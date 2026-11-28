'use strict';

const config = window.SITE_CONFIG;
const templateValues = {};

function configurationError(message) {
  const notice = document.createElement('pre');
  notice.setAttribute('role', 'alert');
  notice.textContent = `Site configuration error: ${message}`;
  document.body.replaceChildren(notice);
  throw new Error(notice.textContent);
}

function configured(path) {
  let value = config;
  for (const part of path.split('.')) value = value?.[part];
  if (value === undefined) configurationError(`Missing "${path}"`);
  return value;
}

function formatCopy(value, values = {}) {
  if (typeof value !== 'string') configurationError('Text values must be strings');
  const variables = { ...templateValues, ...values };
  return value.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (_, key) => {
    if (!Object.hasOwn(variables, key)) configurationError(`Unknown text placeholder "${key}"`);
    return String(variables[key]);
  });
}

function text(path, values) {
  return formatCopy(configured(path), values);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function imageUrl(key) {
  return configured(`media.${key}`);
}

function applyConfiguration() {
  if (!config || typeof config !== 'object') configurationError('site.config.js must define window.SITE_CONFIG');
  templateValues.brand = configured('brand.name');
  templateValues.slideCount = String(document.querySelectorAll('.hero-slide').length).padStart(2, '0');
  for (const [key, value] of Object.entries(configured('media'))) {
    if (typeof value !== 'string' || !value.trim()) configurationError(`Invalid image "media.${key}"`);
    let url;
    try { url = new URL(value, document.baseURI); }
    catch { configurationError(`Invalid image URL "media.${key}"`); }
    if (!['http:', 'https:', 'file:'].includes(url.protocol)) configurationError(`Unsupported image URL "media.${key}"`);
  }
  const ids = new Set();
  for (const product of configured('products')) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id) || ids.has(product.id)) configurationError(`Invalid or duplicate product ID "${product.id}"`);
    ids.add(product.id);
    if (typeof configured(`categories.${product.category}`) !== 'string') configurationError(`Invalid category for "${product.id}"`);
    imageUrl(product.image);
    for (const field of ['name', 'badge', 'description', 'rating', 'reviews']) {
      if (typeof product[field] !== 'string') configurationError(`Invalid product text "${product.id}.${field}"`);
    }
    if (![product.price, product.regular].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) configurationError(`Invalid price for "${product.id}"`);
  }
  const comments = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
  while (walker.nextNode()) if (walker.currentNode.nodeValue.startsWith('copy:')) comments.push(walker.currentNode);
  for (const comment of comments) comment.replaceWith(document.createTextNode(text(comment.nodeValue.slice(5))));
  for (const element of document.querySelectorAll('*')) {
    for (const attribute of [...element.attributes]) {
      if (!attribute.name.startsWith('data-config-')) continue;
      const name = attribute.name.slice('data-config-'.length);
      const value = name === 'image' ? imageUrl(configured(attribute.value)) : text(attribute.value);
      if (name === 'text') element.textContent = value;
      else element.setAttribute(name === 'image' ? 'src' : name, value);
    }
  }
  document.documentElement.style.setProperty('--promotion-background', `url(${JSON.stringify(imageUrl('saleBanner'))})`);
}

applyConfiguration();
const products = configured('products').map(product => ({ ...product, name: formatCopy(product.name), badge: formatCopy(product.badge), description: formatCopy(product.description) }));
const categoryNames = Object.fromEntries(Object.entries(configured('categories')).map(([key, label]) => [key, formatCopy(label)]));
const productById = new Map(products.map(product => [product.id, product]));
const storageKey = 'atohome-storefront-preview-v1';
const state = { cart: [], favorites: [], category: 'all', query: '' };
const shopDialog = document.querySelector('#shop-dialog');
const productDialog = document.querySelector('#product-dialog');
const cartDialog = document.querySelector('#cart-dialog');
const infoDialog = document.querySelector('#info-dialog');
const searchInput = document.querySelector('#product-search');
let toastTimer;

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function money(value) {
  return new Intl.NumberFormat(configured('format.locale'), { style: 'currency', currency: configured('format.currency') }).format(value);
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!saved) return;
    if (!Array.isArray(saved.cart) || !Array.isArray(saved.favorites)) throw new Error('Invalid saved storefront data');
    const ids = new Set();
    state.cart = saved.cart.filter(row => {
      if (!row || !productById.has(row.id) || ids.has(row.id) || !Number.isInteger(row.quantity) || row.quantity < 1 || row.quantity > 99) return false;
      ids.add(row.id);
      return true;
    }).map(({ id, quantity }) => ({ id, quantity }));
    state.favorites = [...new Set(saved.favorites.filter(id => productById.has(id)))];
  } catch (error) {
    console.warn('Could not restore storefront preview data:', error);
    showToast(text('ui.feedback.restoreFailed'));
  }
}

function persistState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ cart: state.cart, favorites: state.favorites }));
  } catch (error) {
    console.warn('Could not save storefront preview data:', error);
    showToast(text('ui.feedback.saveFailed'));
    return false;
  }
  return true;
}

function productCard(product) {
  const favorite = state.favorites.includes(product.id);
  const values = { name: product.name, rating: product.rating, reviews: product.reviews };
  return `<article class="product-card">
    <span class="product-badge">${escapeHtml(product.badge)}</span>
    <button class="icon-button favorite-button" data-favorite="${escapeHtml(product.id)}" aria-label="${escapeHtml(text(favorite ? 'ui.product.favoriteRemove' : 'ui.product.favoriteAdd', values))}" aria-pressed="${favorite}">${icon('heart')}</button>
    <button class="product-image-button" data-product="${escapeHtml(product.id)}" aria-label="${escapeHtml(text('ui.product.view', values))}"><img src="${escapeHtml(imageUrl(product.image))}" alt="${escapeHtml(text('ui.product.imageAlt', values))}" width="600" height="600" loading="lazy"></button>
    <div class="product-card-copy"><p class="product-rating"><span class="sr-only">${escapeHtml(text('ui.product.ratingLabel', values))}</span><span aria-hidden="true">${escapeHtml(text('ui.product.stars'))}</span><span>${escapeHtml(text('ui.product.ratingSummary', values))}</span></p><button class="product-title" data-product="${escapeHtml(product.id)}">${escapeHtml(product.name)}</button><p class="product-prices">${money(product.price)} <del>${money(product.regular)}</del></p><button class="quick-add" data-add="${escapeHtml(product.id)}" aria-label="${escapeHtml(text('ui.product.addLabel', values))}">${escapeHtml(text('ui.product.add'))} ${icon('plus')}</button></div>
  </article>`;
}

function renderTrending() {
  document.querySelector('#trending-products').innerHTML = products.slice(0, 4).map(productCard).join('');
}

function renderShop() {
  const query = state.query.toLowerCase().trim();
  const matches = products.filter(product => {
    const categoryMatch = state.category === 'all' || (state.category === 'favorites' ? state.favorites.includes(product.id) : product.category === state.category);
    return categoryMatch && `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
  });
  document.querySelector('#shop-title').textContent = categoryNames[state.category];
  document.querySelector('#shop-products').innerHTML = matches.map(productCard).join('');
  document.querySelector('#result-count').textContent = text(matches.length === 1 ? 'ui.shop.oneResult' : 'ui.shop.manyResults', { count: matches.length }) + text(state.query ? 'ui.shop.searchSuffix' : 'ui.shop.browseSuffix');
  document.querySelector('#no-results').hidden = matches.length !== 0;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === state.category)));
}

function closeMobileMenu() {
  document.querySelector('#mobile-menu').hidden = true;
  document.querySelector('#mobile-menu-toggle').setAttribute('aria-expanded', 'false');
  document.querySelector('#mobile-menu-toggle').setAttribute('aria-label', text('ui.navigation.open'));
}

function closeExploreMenu() {
  document.querySelector('#explore-menu').hidden = true;
  document.querySelector('#explore-toggle').setAttribute('aria-expanded', 'false');
}

function openShop(category = 'all', focusSearch = false) {
  closeMobileMenu();
  closeExploreMenu();
  state.category = category;
  state.query = '';
  searchInput.value = '';
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  renderShop();
  shopDialog.showModal();
  shopDialog.scrollTop = 0;
  if (focusSearch) searchInput.focus();
}

function openProduct(id) {
  const product = productById.get(id);
  if (!product) return;
  const values = { name: product.name, rating: product.rating, reviews: product.reviews };
  document.querySelector('#product-detail').innerHTML = `<div class="detail-layout"><div class="detail-image"><img src="${escapeHtml(imageUrl(product.image))}" alt="${escapeHtml(text('ui.product.imageAlt', values))}" width="600" height="600"></div><div class="detail-copy"><span class="section-kicker">${escapeHtml(product.badge.toUpperCase())}</span><h2 id="detail-title">${escapeHtml(product.name)}</h2><p class="product-rating"><span aria-hidden="true">${escapeHtml(text('ui.product.stars'))}</span><span>${escapeHtml(text('ui.product.detailRating', values))}</span></p><p class="detail-description">${escapeHtml(product.description)}</p><p class="product-prices">${money(product.price)} <del>${money(product.regular)}</del></p><button class="button button-primary" data-add="${escapeHtml(product.id)}">${escapeHtml(text('ui.product.add'))} ${icon('bag')}</button><p class="detail-features">${icon('shield')}${escapeHtml(text('ui.product.benefits'))}</p></div></div>`;
  productDialog.setAttribute('aria-labelledby', 'detail-title');
  productDialog.showModal();
}

function cartQuantity() {
  return state.cart.reduce((total, row) => total + row.quantity, 0);
}

function updateBagCount() {
  const quantity = cartQuantity();
  document.querySelectorAll('.cart-count').forEach(counter => {
    counter.textContent = quantity;
    counter.hidden = quantity === 0;
  });
  document.querySelector('[data-cart]').setAttribute('aria-label', text(quantity === 1 ? 'ui.cart.openOne' : 'ui.cart.openMany', { count: quantity }));
}

function addToCart(id) {
  const product = productById.get(id);
  if (!product) return;
  const row = state.cart.find(item => item.id === id);
  if (row && row.quantity === 99) {
    showToast(text('ui.feedback.quantityLimit', { limit: 99 }));
    return;
  }
  if (row) row.quantity += 1;
  else state.cart.push({ id, quantity: 1 });
  updateBagCount();
  if (persistState()) showToast(text('ui.feedback.added', { name: product.name }));
  if (cartDialog.open) renderCart();
}

function renderCart() {
  const container = document.querySelector('#cart-items');
  document.querySelector('#bag-quantity').textContent = text('ui.cart.quantity', { count: cartQuantity() });
  document.querySelector('#cart-summary').hidden = state.cart.length === 0;
  document.querySelector('#checkout-note').hidden = true;
  if (!state.cart.length) {
    container.innerHTML = `<div class="cart-empty">${icon('bag')}<h3>${escapeHtml(text('ui.cart.emptyTitle'))}</h3><p>${escapeHtml(text('ui.cart.emptyDescription'))}</p><button class="button button-primary" data-shop="all">${escapeHtml(text('ui.cart.emptyAction'))} ${icon('arrow')}</button></div>`;
    return;
  }
  container.innerHTML = state.cart.map(row => {
    const product = productById.get(row.id);
    const values = { name: product.name };
    return `<article class="cart-row"><img src="${escapeHtml(imageUrl(product.image))}" alt="${escapeHtml(text('ui.product.imageAlt', values))}" width="90" height="100"><div><h3>${escapeHtml(product.name)}</h3><p class="cart-row-price">${money(product.price)}</p><div class="cart-row-bottom"><div class="quantity-control"><button data-quantity="${escapeHtml(row.id)}" data-change="-1" aria-label="${escapeHtml(text('ui.cart.decrease', values))}">${icon('minus')}</button><span aria-label="${escapeHtml(text('ui.cart.quantityLabel'))}">${row.quantity}</span><button data-quantity="${escapeHtml(row.id)}" data-change="1" aria-label="${escapeHtml(text('ui.cart.increase', values))}" ${row.quantity >= 99 ? 'disabled' : ''}>${icon('plus')}</button></div><button class="remove-item" data-remove="${escapeHtml(row.id)}" aria-label="${escapeHtml(text('ui.cart.removeLabel', values))}">${escapeHtml(text('ui.cart.remove'))}</button></div></div></article>`;
  }).join('');
  const cents = state.cart.reduce((total, row) => total + Math.round(productById.get(row.id).price * 100) * row.quantity, 0);
  document.querySelector('#cart-total').textContent = money(cents / 100);
}

function openCart() {
  closeMobileMenu();
  closeExploreMenu();
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  renderCart();
  cartDialog.showModal();
}

function changeQuantity(id, change) {
  const row = state.cart.find(item => item.id === id);
  if (!row) return;
  row.quantity = Math.min(99, row.quantity + change);
  if (row.quantity <= 0) state.cart = state.cart.filter(item => item.id !== id);
  persistState();
  renderCart();
  updateBagCount();
  const updatedControl = cartDialog.querySelector(`[data-quantity="${id}"][data-change="${change}"]`);
  if (updatedControl && !updatedControl.disabled) updatedControl.focus();
  else cartDialog.querySelector('.dialog-top [data-close]').focus();
}

function toggleFavorite(id) {
  if (!productById.has(id)) return;
  const wasSaved = state.favorites.includes(id);
  state.favorites = wasSaved ? state.favorites.filter(item => item !== id) : [...state.favorites, id];
  if (persistState()) showToast(text(wasSaved ? 'ui.feedback.favoriteRemoved' : 'ui.feedback.favoriteSaved'));
  // Update in place so keyboard focus stays on the button that was pressed.
  document.querySelectorAll('[data-favorite]').forEach(button => {
    if (button.dataset.favorite !== id) return;
    button.setAttribute('aria-pressed', String(!wasSaved));
    button.setAttribute('aria-label', text(wasSaved ? 'ui.product.favoriteAdd' : 'ui.product.favoriteRemove', { name: productById.get(id).name }));
  });
  if (state.category === 'favorites' && shopDialog.open) renderShop();
}


function openInfo(key) {
  const { title, copy } = configured(`info.${key}`);
  document.querySelector('#info-title').textContent = formatCopy(title);
  document.querySelector('#info-copy').textContent = formatCopy(copy);
  infoDialog.showModal();
}

document.addEventListener('click', event => {
  const button = event.target.closest('button, a');
  if (!button) return;
  if (button.dataset.shop) return openShop(button.dataset.shop);
  if (button.hasAttribute('data-search')) return openShop('all', true);
  if (button.hasAttribute('data-cart')) return openCart();
  if (button.dataset.product) return openProduct(button.dataset.product);
  if (button.dataset.add) return addToCart(button.dataset.add);
  if (button.dataset.favorite) return toggleFavorite(button.dataset.favorite);
  if (button.dataset.info) return openInfo(button.dataset.info);
  if (button.hasAttribute('data-close')) return button.closest('dialog').close();
  if (button.dataset.filter) {
    state.category = button.dataset.filter;
    renderShop();
    return;
  }
  if (button.dataset.quantity) return changeQuantity(button.dataset.quantity, Number(button.dataset.change));
  if (button.dataset.remove) {
    state.cart = state.cart.filter(row => row.id !== button.dataset.remove);
    persistState();
    renderCart();
    updateBagCount();
  }
});

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  renderShop();
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.setAttribute('aria-modal', 'true');
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
shopDialog.setAttribute('aria-labelledby', 'shop-title');
cartDialog.setAttribute('aria-label', text('ui.cart.dialogLabel'));
infoDialog.setAttribute('aria-labelledby', 'info-title');

document.querySelectorAll('.newsletter-form').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const feedback = form.parentElement.querySelector('.form-feedback');
  feedback.textContent = text('ui.feedback.subscription');
}));

document.querySelector('#checkout-button').addEventListener('click', () => {
  document.querySelector('#checkout-note').hidden = false;
});

const mobileToggle = document.querySelector('#mobile-menu-toggle');
mobileToggle.addEventListener('click', () => {
  const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
  document.querySelector('#mobile-menu').hidden = isOpen;
  mobileToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileToggle.setAttribute('aria-label', text(isOpen ? 'ui.navigation.open' : 'ui.navigation.close'));
});
document.querySelectorAll('#mobile-menu a').forEach(link => link.addEventListener('click', closeMobileMenu));
const exploreToggle = document.querySelector('#explore-toggle');
exploreToggle.addEventListener('click', () => {
  const isOpen = exploreToggle.getAttribute('aria-expanded') === 'true';
  document.querySelector('#explore-menu').hidden = isOpen;
  exploreToggle.setAttribute('aria-expanded', String(!isOpen));
});
document.querySelectorAll('#explore-menu a').forEach(link => link.addEventListener('click', closeExploreMenu));
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) closeExploreMenu();
  if (!event.target.closest('.site-header')) closeMobileMenu();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!document.querySelector('#mobile-menu').hidden) {
    closeMobileMenu();
    mobileToggle.focus();
  }
  if (!document.querySelector('#explore-menu').hidden) {
    closeExploreMenu();
    exploreToggle.focus();
  }
});

const header = document.querySelector('#site-header');
function updateStickyHeader() {
  header.classList.toggle('is-sticky', window.scrollY > 130);
}
window.addEventListener('scroll', updateStickyHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobileMenu();
});
updateStickyHeader();

const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('[data-goto]')];
const pauseButton = document.querySelector('#slide-pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = 0;
let userPaused = reducedMotion.matches;
let slideTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === currentSlide);
    slide.setAttribute('aria-hidden', String(i !== currentSlide));
    slide.setAttribute('aria-label', text('ui.slideshow.position', { index: i + 1, total: slides.length }));
    slide.inert = i !== currentSlide;
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === currentSlide);
    dot.setAttribute('aria-pressed', String(i === currentSlide));
  });
  document.querySelector('#current-slide').textContent = String(currentSlide + 1).padStart(2, '0');
}

function scheduleSlide() {
  clearInterval(slideTimer);
  if (userPaused || document.hidden || document.querySelector('dialog[open]') || document.querySelector('.hero').contains(document.activeElement)) return;
  slideTimer = setInterval(() => showSlide(currentSlide + 1), 8000);
}

function updatePauseButton() {
  pauseButton.setAttribute('aria-label', text(userPaused ? 'ui.slideshow.playLabel' : 'ui.slideshow.pauseLabel'));
  pauseButton.setAttribute('aria-pressed', String(userPaused));
  pauseButton.querySelector('span').textContent = text(userPaused ? 'ui.slideshow.playSymbol' : 'ui.slideshow.pauseSymbol');
}

dots.forEach(dot => dot.addEventListener('click', () => {
  showSlide(Number(dot.dataset.goto));
  scheduleSlide();
}));
pauseButton.addEventListener('click', () => {
  userPaused = !userPaused;
  updatePauseButton();
  scheduleSlide();
});
reducedMotion.addEventListener('change', event => {
  userPaused = event.matches;
  updatePauseButton();
  scheduleSlide();
});
document.addEventListener('visibilitychange', scheduleSlide);
document.querySelector('.hero').addEventListener('focusin', () => clearInterval(slideTimer));
document.querySelector('.hero').addEventListener('focusout', () => setTimeout(scheduleSlide, 0));
new MutationObserver(scheduleSlide).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['open'] });
updatePauseButton();
scheduleSlide();

let touchStartX = 0;
let touchStartY = 0;
document.querySelector('.hero').addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });
document.querySelector('.hero').addEventListener('touchend', event => {
  const dx = event.changedTouches[0].clientX - touchStartX;
  const dy = event.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    showSlide(currentSlide + (dx < 0 ? 1 : -1));
    scheduleSlide();
  }
}, { passive: true });

document.querySelectorAll('[data-tech]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.tech);
  document.querySelectorAll('.tech-item').forEach((item, i) => {
    item.classList.toggle('is-active', i === index);
    item.querySelector('button').setAttribute('aria-expanded', String(i === index));
    item.querySelector('button span').textContent = text(i === index ? 'ui.accordion.expanded' : 'ui.accordion.collapsed');
    item.querySelector('p').hidden = i !== index;
  });
  const image = document.querySelector('#technology-image');
  const item = configured(`technology.images.${index}`);
  image.src = imageUrl(item.image);
  image.alt = formatCopy(item.alt);
}));

const promotionEnd = new Date(configured('promotion.endsAt')).getTime();
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((promotionEnd - Date.now()) / 1000));
  const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((unit, i) => {
    document.querySelector(`#count-${unit}`).textContent = String(values[i]).padStart(2, '0');
  });
  if (remaining === 0) {
    document.querySelector('#promo-title').textContent = text('promotion.expired.title');
    document.querySelector('.promo-banner>p').textContent = text('promotion.expired.description');
    document.querySelector('.promo-banner>.button').innerHTML = `${escapeHtml(text('promotion.expired.action'))} ${icon('arrow')}`;
  }
}

if (!Number.isFinite(promotionEnd)) configurationError('Invalid promotion.endsAt');
showSlide(0);
document.querySelector('#cart-total').textContent = money(0);
restoreState();
renderTrending();
updateBagCount();
updateCountdown();
setInterval(updateCountdown, 1000);
