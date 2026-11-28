const {test} = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../google-apps-script/Code.gs'), 'utf8');

function harness(options = {}) {
  const contacts = options.contacts || [];
  const properties = new Map();
  const cache = new Map();
  const changes = [];
  let released = 0;
  const group = {resourceName: 'contactGroups/subscribers', name: 'atohome Subscribers', groupType: 'USER_CONTACT_GROUP'};
  const context = {
    console: {log() {}, error(message) {changes.push({error: message});}},
    Session: {getEffectiveUser: () => ({getEmail: () => options.owner || 'info.atohome@gmail.com'})},
    LockService: {getScriptLock: () => ({tryLock: () => !options.busy, releaseLock: () => released++})},
    CacheService: {getScriptCache: () => ({get: key => cache.get(key), put: (key, value) => cache.set(key, value)})},
    PropertiesService: {getScriptProperties: () => ({getProperty: key => properties.get(key), setProperties: values => Object.entries(values).forEach(([key, value]) => properties.set(key, value))})},
    Utilities: {DigestAlgorithm: {SHA_256:'sha256'}, computeDigest: (_, value) => [...crypto.createHash('sha256').update(value).digest()], formatDate: () => '2026-11-28'},
    HtmlService: {XFrameOptionsMode: {ALLOWALL:'ALLOWALL'}, createHtmlOutput: html => ({html, setXFrameOptionsMode() {return this;}})},
    People: {
      ContactGroups: {
        list: () => ({contactGroups: options.noGroup ? [] : [group]}),
        create: body => {changes.push({createGroup:body}); return group;},
        Members: {modify: (body, name) => {changes.push({membership: body, group:name}); return options.membershipMissing ? {notFoundResourceNames: body.resourceNamesToAdd} : {}; }},
      },
      People: {
        Connections: {list: (_, params) => {
          if (options.failRead) throw new Error('Failed to read contacts for private@example.com');
          if (options.paginate && !params.pageToken) return {connections:[], nextPageToken:'page-2'};
          return {connections:contacts};
        }},
        createContact: body => {
          if (options.failCreate) throw new Error('Google rejected private@example.com');
          changes.push({createContact:body});
          return {resourceName:'people/new-contact', memberships:options.missingCreatedLabel ? [] : body.memberships};
        },
      },
    },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  function post(overrides = {}) {
    return context.doPost({postData:{length:100}, parameter: {
      origin:'https://atohome.cn', requestId:'a'.repeat(32), email:' New@Example.com ',
      source:'newsletter', consent:'yes', website:'', ...overrides,
    }}).html;
  }
  return {context, post, changes, properties, cache, released: () => released};
}

test('new signup creates one normalized contact with subscriber membership', () => {
  const h = harness();
  assert.match(h.post(), /"code":"subscribed"/);
  const creation = h.changes.find(change => change.createContact).createContact;
  assert.equal(creation.emailAddresses[0].value, 'new@example.com');
  assert.equal(creation.memberships[0].contactGroupMembership.contactGroupResourceName, 'contactGroups/subscribers');
  assert.equal(h.released(), 1);
  assert.ok(h.cache.size === 1);
  assert.ok(![...h.cache.keys()][0].includes('new@example.com'));
});

test('existing contact gains only the newsletter label, including paginated contacts', () => {
  const h = harness({paginate:true, contacts:[{resourceName:'people/existing', names:[{givenName:'Keep me'}], emailAddresses:[{value:'NEW@example.com'}], memberships:[]}]});
  assert.match(h.post(), /"code":"subscribed"/);
  assert.equal(h.changes.length, 1);
  assert.equal(h.changes[0].membership.resourceNamesToAdd[0], 'people/existing');
});

test('an already subscribed contact does not get created or mutated', () => {
  const h = harness({contacts:[{resourceName:'people/member', emailAddresses:[{value:'new@example.com'}], memberships:[{contactGroupMembership:{contactGroupResourceName:'contactGroups/subscribers'}}]}]});
  assert.match(h.post(), /"code":"subscribed"/);
  assert.equal(h.changes.length, 0);
});

test('duplicate requests are limited without storing the email in cache or properties', () => {
  const h = harness();
  h.post();
  assert.match(h.post(), /"code":"rate_limited"/);
  assert.equal(h.changes.filter(change => change.createContact).length, 1);
  assert.ok(!JSON.stringify([...h.properties]).includes('new@example.com'));
});

test('origin, request ID, consent, honeypot and email are checked before contact changes', () => {
  for (const values of [{origin:'https://evil.example'}, {requestId:'invalid'}, {consent:'no'}, {website:'bot'}, {email:'bad'}, {email:'a..b@example.com'}, {email:'a@-bad.com'}, {source:'unknown'}, {email:'private\r\n@example.com'}]) {
    const h = harness();
    assert.doesNotMatch(h.post(values), /"code":"subscribed"/);
    assert.equal(h.changes.length, 0);
  }
});

test('wrong deployment account fails visibly without modifying contacts', () => {
  const h = harness({owner:'wrong@gmail.com'});
  assert.match(h.post(), /"code":"failed"/);
  assert.equal(h.changes.filter(change => change.createContact || change.membership).length, 0);
  assert.equal(h.released(), 1);
});

test('Google read/write/membership errors fail and redact email in diagnostics', () => {
  for (const options of [{failRead:true}, {failCreate:true}, {missingCreatedLabel:true}, {membershipMissing:true, contacts:[{resourceName:'people/missing',emailAddresses:[{value:'new@example.com'}]}]}]) {
    const h = harness(options);
    assert.match(h.post(), /"code":"failed"/);
    const error = h.changes.find(change => change.error).error;
    assert.ok(!error.includes('private@example.com'));
    assert.equal(h.released(), 1);
  }
});

test('busy and daily cap return recoverable statuses without touching contacts', () => {
  const busy = harness({busy:true});
  assert.match(busy.post(), /"code":"busy"/);
  assert.equal(busy.changes.length, 0);
  const capped = harness();
  capped.properties.set('newsletterDay','2026-11-28');
  capped.properties.set('newsletterRequests','250');
  assert.match(capped.post(), /"code":"daily_limit"/);
  assert.equal(capped.changes.length, 0);
});

test('setup creates the label only; responses send no address and use an exact target origin', () => {
  const h = harness({noGroup:true});
  h.context.setupNewsletter();
  assert.equal(h.changes.length, 1);
  assert.equal(h.changes[0].createGroup.contactGroup.name, 'atohome Subscribers');
  const result = h.context.subscriptionReply_('https://atohome.cn', 'a'.repeat(32), 'subscribed').html;
  assert.ok(!result.includes('new@example.com'));
  assert.match(result, /window.top.postMessage/);
  assert.match(result, /,"https:\/\/atohome.cn"/);
});
