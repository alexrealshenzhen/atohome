'use strict';

const NEWSLETTER = Object.freeze({
  owner: 'info.atohome@gmail.com',
  label: 'atohome Subscribers',
  origins: ['https://atohome.cn', 'https://www.atohome.cn'],
  dailyLimit: 250,
  retryAfter: 60,
});

// Run once from the editor to authorize the account and create the label.
function setupNewsletter() {
  assertOwner_();
  const group = subscriberGroup_();
  console.log('Newsletter label ready: ' + group.resourceName);
}

function doGet() {
  return HtmlService.createHtmlOutput('atohome newsletter endpoint. Submit from https://atohome.cn.');
}

function doPost(event) {
  const values = event && event.parameter ? event.parameter : {};
  const origin = NEWSLETTER.origins.includes(values.origin) ? values.origin : null;
  const requestId = typeof values.requestId === 'string' && /^[a-f0-9]{32}$/.test(values.requestId) ? values.requestId : null;
  // Never post data to an origin supplied by an untrusted request.
  if (!origin || !requestId) return HtmlService.createHtmlOutput('Invalid subscription request.');

  if (!event.postData || event.postData.length > 4096 || !/^(newsletter|footer)$/.test(values.source || '') || values.consent !== 'yes' || values.website) {
    return subscriptionReply_(origin, requestId, 'invalid');
  }
  const email = normalizeEmail_(values.email);
  if (!email) return subscriptionReply_(origin, requestId, 'invalid');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return subscriptionReply_(origin, requestId, 'busy');
  try {
    assertOwner_();
    const cache = CacheService.getScriptCache();
    const key = 'newsletter:' + Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email)
      .map(value => ('0' + ((value + 256) % 256).toString(16)).slice(-2)).join('');
    if (cache.get(key)) return subscriptionReply_(origin, requestId, 'rate_limited');
    if (!reserveDailyRequest_()) return subscriptionReply_(origin, requestId, 'daily_limit');
    cache.put(key, '1', NEWSLETTER.retryAfter);

    saveSubscriber_(email, subscriberGroup_().resourceName);
    return subscriptionReply_(origin, requestId, 'subscribed');
  } catch (error) {
    // Service errors can include addresses. Keep diagnostics without logging PII.
    const message = String(error.message || error).replace(/[^\s@]+@[^\s@]+/g, '[email]').slice(0, 250);
    console.error(JSON.stringify({ event: 'newsletter_save_failed', requestId: requestId, message: message }));
    return subscriptionReply_(origin, requestId, 'failed');
  } finally {
    lock.releaseLock();
  }
}

function assertOwner_() {
  if (Session.getEffectiveUser().getEmail().toLowerCase() !== NEWSLETTER.owner) {
    throw new Error('Deploy the web app as the configured newsletter owner.');
  }
}

function normalizeEmail_(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || /[\s\x00-\x1f\x7f]/.test(email)) return null;
  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || parts[0].length > 64 || !/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+$/i.test(parts[0])) return null;
  if (parts[0].startsWith('.') || parts[0].endsWith('.') || parts[0].includes('..')) return null;
  const labels = parts[1].split('.');
  if (labels.length < 2 || !labels.every(label => label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) return null;
  return email;
}

function reserveDailyRequest_() {
  const properties = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
  const day = properties.getProperty('newsletterDay');
  const count = day === today ? Number(properties.getProperty('newsletterRequests') || '0') : 0;
  if (!Number.isFinite(count) || count >= NEWSLETTER.dailyLimit) return false;
  properties.setProperties({ newsletterDay: today, newsletterRequests: String(count + 1) });
  return true;
}

function subscriberGroup_() {
  let pageToken;
  do {
    const result = People.ContactGroups.list({ pageSize: 1000, pageToken: pageToken });
    const group = (result.contactGroups || []).find(group => group.groupType === 'USER_CONTACT_GROUP' && group.name === NEWSLETTER.label);
    if (group) return group;
    pageToken = result.nextPageToken;
  } while (pageToken);
  const group = People.ContactGroups.create({ contactGroup: { name: NEWSLETTER.label } });
  if (!group.resourceName) throw new Error('Contact label creation returned no resource name.');
  return group;
}

function saveSubscriber_(email, groupName) {
  let pageToken;
  do {
    const page = People.People.Connections.list('people/me', {
      personFields: 'emailAddresses,memberships', pageSize: 1000, pageToken: pageToken,
    });
    const contact = (page.connections || []).find(person => (person.emailAddresses || []).some(address => address.value.trim().toLowerCase() === email));
    if (contact) {
      const alreadyMember = (contact.memberships || []).some(member => member.contactGroupMembership && member.contactGroupMembership.contactGroupResourceName === groupName);
      if (alreadyMember) return;
      const result = People.ContactGroups.Members.modify({ resourceNamesToAdd: [contact.resourceName] }, groupName);
      if ((result.notFoundResourceNames || []).length) throw new Error('Contact could not be added to the subscriber label.');
      return;
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  // Create the contact and its membership together; do not alter other contacts.
  const created = People.People.createContact({
    emailAddresses: [{ value: email }],
    memberships: [{ contactGroupMembership: { contactGroupResourceName: groupName } }],
  }, { personFields: 'emailAddresses,memberships' });
  const labeled = (created.memberships || []).some(member => member.contactGroupMembership && member.contactGroupMembership.contactGroupResourceName === groupName);
  if (!created.resourceName || !labeled) throw new Error('Contact creation did not confirm the subscriber label.');
}

function subscriptionReply_(origin, requestId, code) {
  const message = JSON.stringify({ type: 'atohome-newsletter', requestId: requestId, code: code })
    .replace(/</g, '\\u003c');
  const target = JSON.stringify(origin);
  // HtmlService runs in Google's sandboxed frame. The site validates its origin
  // and a random per-request ID rather than relying on an opaque fetch response.
  return HtmlService.createHtmlOutput('<!doctype html><html><head><meta name="referrer" content="no-referrer"></head><body><script>window.top.postMessage(' + message + ',' + target + ');</script></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
