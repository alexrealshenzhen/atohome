const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function harness({url = 'https://atohome.cn/', saved, mutate} = {}) {
  const values = new Map(saved === undefined ? [] : [['atohome-language', saved]]);
  const events = [];
  const document = {
    body: {replaceChildren() {}},
    createElement: () => ({setAttribute() {}}),
    createTreeWalker: () => ({nextNode: () => false}),
    querySelectorAll: () => [],
    querySelector: () => ({textContent: ''}),
  };
  const window = {
    location: {href: url},
    localStorage: {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)},
    history: {replaceState: (_, __, next) => {window.location.href = String(next);}},
    dispatchEvent: event => events.push(event.type),
  };
  const context = vm.createContext({window, document, URL, console, NodeFilter: {SHOW_COMMENT: 128}, CustomEvent: class {constructor(type) {this.type = type;}}});
  for (const file of ['site.config.js', 'locales/en.js', 'locales/es.js']) vm.runInContext(read(file), context);
  if (mutate) mutate(window);
  vm.runInContext(read('i18n.js'), context);
  return {window, values, events, i18n: window.StoreI18n};
}

test('catalog retains four canonical categories, valid product IDs and four JH featured products', () => {
  const {window} = harness();
  const config = window.SITE_CONFIG;
  assert.deepEqual(Array.from(config.categoryIds), ['air', 'car-air', 'hair-dryer', 'filters']);
  assert.equal(new Set(config.products.map(product => product.id)).size, config.products.length);
  assert.ok(config.products.every(product => config.categoryIds.includes(product.category)));
  assert.deepEqual(Array.from(config.featuredProducts), ['jh02', 'jh05', 'jh06', 'jh08']);
  assert.ok(config.featuredProducts.every(id => config.products.some(product => product.id === id)));
  assert.equal(config.products.filter(product => product.category === 'car-air').length, 0);
  for (const language of ['en', 'es']) {
    assert.deepEqual(Object.keys(window.SITE_LOCALES[language].categories).sort(), ['air', 'all', 'car-air', 'favorites', 'filters', 'hair-dryer']);
  }
  assert.equal(window.SITE_LOCALES.en.categories.filters, 'Filters & Accessories');
});

test('all category navigation surfaces include the canonical catalog categories', () => {
  const {window} = harness();
  const html = read('index.html');
  const surfaces = {
    desktop: /<nav\b[^>]*class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/,
    mobile: /<nav\b[^>]*id="mobile-menu"[^>]*>([\s\S]*?)<\/nav>/,
    cards: /<div class="category-grid">([\s\S]*?)<\/div>/,
    footer: /<div class="footer-column"><h3><!--copy:categories.all--><\/h3>([\s\S]*?)<\/div>/,
    filters: /<div class="filter-tabs"[^>]*>([\s\S]*?)<\/div>/,
  };
  for (const [name, pattern] of Object.entries(surfaces)) {
    const section = html.match(pattern)?.[1];
    assert.ok(section, `Missing category surface: ${name}`);
    const categories = [...section.matchAll(/data-(?:shop|filter)="([^"]+)"/g)].map(match => match[1]).filter(id => !['all', 'favorites'].includes(id));
    assert.deepEqual(categories, Array.from(window.SITE_CONFIG.categoryIds), name);
  }
});

test('hair dryers expose known images without invented prices, ratings or specifications', () => {
  const {window} = harness();
  const dryers = window.SITE_CONFIG.products.filter(product => product.category === 'hair-dryer');
  assert.equal(dryers.length, 2);
  for (const product of dryers) {
    for (const field of ['price', 'regular', 'rating', 'reviews']) assert.equal(product[field], null);
    assert.ok(fs.existsSync(path.join(root, window.SITE_CONFIG.media[product.image])));
    const colors = {en: {'hair-dryer-red': 'Red', 'hair-dryer-blue': 'Blue'}, es: {'hair-dryer-red': 'Rojo', 'hair-dryer-blue': 'Azul'}};
    for (const language of ['en', 'es']) {
      const specifications = window.SITE_LOCALES[language].productText[product.id].specifications;
      assert.equal(specifications.length, 1);
      assert.equal(specifications[0].label, 'Color');
      assert.equal(specifications[0].value, colors[language][product.id]);
    }
  }
});

test('every static text and attribute binding resolves in both languages', () => {
  const {i18n} = harness();
  const html = read('index.html');
  const paths = [...html.matchAll(/<!--copy:([^>]+)-->/g), ...html.matchAll(/data-config-[a-z-]+="([^"]+)"/g)].map(match => match[1]);
  assert.ok(paths.length > 150);
  for (const language of ['en', 'es']) {
    i18n.selectLanguage(language);
    for (const key of paths) assert.equal(typeof i18n.read(key), 'string', `${language}.${key}`);
  }
});

test('missing translation keys fail explicitly', () => {
  assert.throws(() => harness({mutate: window => {delete window.SITE_LOCALES.es.ui.shared.emailLabel;}}), /Translation keys differ/);
});

test('placeholder mismatches fail explicitly', () => {
  assert.throws(() => harness({mutate: window => {window.SITE_LOCALES.es.meta.title += ' {missing}';}}), /Placeholders differ/);
});

test('translation arrays and product translations must cover the shared catalog', () => {
  assert.throws(() => harness({mutate: window => {window.SITE_LOCALES.es.technology.alts.pop();}}), /Translation keys differ|Array length differs/);
  assert.throws(() => harness({mutate: window => {window.SITE_CONFIG.products.push({...window.SITE_CONFIG.products[0], id: 'untranslated'});}}), /Product translations differ/);
});

test('URL language takes priority over the saved preference', () => {
  assert.equal(harness({url: 'https://atohome.cn/?lang=es', saved: 'en'}).i18n.language, 'es');
  assert.equal(harness({url: 'https://atohome.cn/?lang=en', saved: 'es'}).i18n.language, 'en');
});

test('saved preference and explicit invalid URL use documented defaults', () => {
  assert.equal(harness({saved: 'es'}).i18n.language, 'es');
  assert.equal(harness({saved: 'invalid'}).i18n.language, 'en');
  assert.equal(harness({url: 'https://atohome.cn/?lang=invalid', saved: 'es'}).i18n.language, 'en');
  assert.equal(harness().i18n.language, 'en');
});

test('EN to ES to EN preserves shared product data and stores the preference', () => {
  const {i18n, window, values, events} = harness();
  const original = JSON.stringify(window.SITE_CONFIG);
  const english = i18n.read('categories.air');
  i18n.selectLanguage('es');
  assert.notEqual(i18n.read('categories.air'), english);
  assert.equal(new URL(window.location.href).searchParams.get('lang'), 'es');
  assert.equal(values.get('atohome-language'), 'es');
  i18n.selectLanguage('en');
  assert.equal(i18n.read('categories.air'), english);
  assert.equal(JSON.stringify(window.SITE_CONFIG), original);
  assert.deepEqual(events, ['site-language-change', 'site-language-change']);
});

test('unknown language, missing text and unknown placeholders fail explicitly', () => {
  const {i18n} = harness();
  assert.throws(() => i18n.selectLanguage('fr'), /Unsupported language/);
  assert.throws(() => i18n.read('ui.missing'), /Missing/);
  assert.throws(() => i18n.format('{unknown}'), /Unknown placeholder/);
});

test('Pages includes all runtime scripts and language resources', () => {
  const workflow = read('.github/workflows/pages.yml');
  for (const file of ['index.html', 'styles.css', 'app.js', 'i18n.js', 'site.config.js', 'CNAME', '.nojekyll']) {
    assert.ok(workflow.includes(file), `Missing publication entry: ${file}`);
    assert.ok(fs.existsSync(path.join(root, file)));
  }
  assert.match(workflow, /cp -R locales _site\/locales/);
  assert.match(workflow, /cp -R assets _site\/assets/);
});
