'use strict';

(() => {
  const shared = window.SITE_CONFIG;
  const locales = window.SITE_LOCALES;
  const languages = ['en', 'es'];
  const preferenceKey = 'atohome-language';
  const bindings = [];
  let language = shared?.defaultLanguage;

  function fail(message) {
    if (typeof document !== 'undefined') {
      const notice = document.createElement('pre');
      notice.setAttribute('role', 'alert');
      notice.textContent = `Site language configuration error: ${message}`;
      document.body.replaceChildren(notice);
    }
    throw new Error(`Site language configuration error: ${message}`);
  }

  function shape(value, path = '', result = {}) {
    if (typeof value === 'string') result[path] = value;
    else if (Array.isArray(value)) {
      result[`${path}.$length`] = value.length;
      value.forEach((child, index) => shape(child, `${path}.${index}`, result));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => shape(child, path ? `${path}.${key}` : key, result));
    } else fail(`Expected localized text at "${path}"`);
    return result;
  }

  function placeholders(value) {
    return [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map(match => match[1]).sort().join(',');
  }

  function validate() {
    if (!shared || !languages.includes(shared.defaultLanguage)) fail('Invalid default language');
    if (!locales?.en || !locales.es) fail('English and Spanish resources are required');
    const reference = shape(locales.en);
    for (const code of languages) {
      const candidate = shape(locales[code]);
      if (JSON.stringify(Object.keys(reference).sort()) !== JSON.stringify(Object.keys(candidate).sort())) fail(`Translation keys differ for "${code}"`);
      for (const [path, value] of Object.entries(reference)) {
        if (typeof value === 'number') {
          if (candidate[path] !== value) fail(`Array length differs at "${code}.${path}"`);
        } else if (placeholders(value) !== placeholders(candidate[path])) fail(`Placeholders differ at "${code}.${path}"`);
      }
      const ids = shared.products.map(product => product.id).sort();
      if (JSON.stringify(ids) !== JSON.stringify(Object.keys(locales[code].productText).sort())) fail(`Product translations differ for "${code}"`);
    }
  }

  function configuration() {
    const local = locales[language];
    return {
      ...shared,
      meta: local.meta, categories: local.categories, copy: local.copy, ui: local.ui, info: local.info,
      format: {...shared.format, ...local.format},
      promotion: {...shared.promotion, ...local.promotion},
      technology: {images: shared.technology.images.map((image, index) => ({...image, alt: local.technology.alts[index]}))},
      products: shared.products.map(product => ({...product, ...local.productText[product.id]})),
    };
  }

  function variables() {
    return {brand: shared.brand.name, contactEmail: shared.newsletter.contactEmail, slideCount: String(document.querySelectorAll('.hero-slide').length).padStart(2, '0')};
  }

  function read(path) {
    let value = configuration();
    for (const part of path.split('.')) value = value?.[part];
    if (value === undefined) fail(`Missing "${language}.${path}"`);
    return value;
  }

  function format(value, values = {}) {
    if (typeof value !== 'string') fail('Expected a text value');
    const available = {...variables(), ...values};
    return value.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (_, key) => {
      if (!Object.hasOwn(available, key)) fail(`Unknown placeholder "${key}"`);
      return String(available[key]);
    });
  }

  function bind() {
    if (bindings.length) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.startsWith('copy:')) comments.push(walker.currentNode);
    for (const comment of comments) {
      const node = document.createTextNode('');
      bindings.push({node, path: comment.nodeValue.slice(5)});
      comment.replaceWith(node);
    }
    for (const element of document.querySelectorAll('*')) {
      for (const attribute of [...element.attributes]) {
        if (attribute.name.startsWith('data-config-')) bindings.push({element, name: attribute.name.slice(12), path: attribute.value});
      }
    }
  }

  function render() {
    for (const binding of bindings) {
      const raw = read(binding.path);
      if (binding.node) {
        // A dynamic view may have replaced this node; that view owns its text.
        if (binding.node.isConnected) binding.node.nodeValue = format(raw);
        continue;
      }
      const {element, name} = binding;
      const value = name === 'image' ? read(`media.${raw}`) : format(raw);
      if (name === 'text') element.textContent = value;
      else element.setAttribute(name === 'image' ? 'src' : name === 'mailto' ? 'href' : name, name === 'mailto' ? `mailto:${value}` : value);
    }
    document.querySelectorAll('[data-language]').forEach(select => {select.value = language;});
  }

  function initialLanguage() {
    const requested = new URL(window.location.href).searchParams.get('lang');
    if (requested !== null) return languages.includes(requested) ? requested : shared.defaultLanguage;
    try {
      const saved = window.localStorage.getItem(preferenceKey);
      return languages.includes(saved) ? saved : shared.defaultLanguage;
    } catch (error) {
      console.warn('Language preference could not be read:', error.name);
      return shared.defaultLanguage;
    }
  }

  function selectLanguage(code) {
    if (!languages.includes(code)) fail(`Unsupported language "${code}"`);
    language = code;
    let saved = true;
    try { window.localStorage.setItem(preferenceKey, code); }
    catch (error) { saved = false; console.warn('Language preference could not be saved:', error.name); }
    const url = new URL(window.location.href);
    url.searchParams.set('lang', code);
    window.history.replaceState(null, '', url);
    render();
    window.dispatchEvent(new CustomEvent('site-language-change'));
    document.querySelector('#language-status').textContent = saved ? '' : format(read('ui.language.saveFailed'));
  }

  validate();
  if (typeof document !== 'undefined') {
    language = initialLanguage();
    bind();
    render();
    document.querySelectorAll('[data-language]').forEach(select => select.addEventListener('change', () => selectLanguage(select.value)));
  }
  window.StoreI18n = {configuration, format, read, render, selectLanguage, validate, get language() {return language;}};
})();
