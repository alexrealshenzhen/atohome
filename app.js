'use strict';

const products = [
  { id: 'vital-200s', name: 'Vital 200S-P Smart Air Purifier', category: 'air', image: 'product-vital', price: 159.99, regular: 189.99, rating: '4.8', reviews: '2,640', badge: 'Bestseller', description: 'A fresh start for pet-friendly homes. The Vital 200S-P captures pet hair, dander, and everyday airborne particles, with smart control that makes cleaner air feel effortless.' },
  { id: 'lvac-200', name: 'LVAC-200 Cordless Vacuum Cleaner', category: 'vacuums', image: 'product-vacuum', price: 139.99, regular: 199.99, rating: '4.7', reviews: '1,820', badge: 'Save $60', description: 'Lightweight, powerful, and ready for real life. Make quick work of everyday crumbs and pet hair with cordless freedom, versatile attachments, and an easy-empty dustbin.' },
  { id: 'core-300', name: 'Core® 300-P Air Purifier', category: 'air', image: 'product-core', price: 80.99, regular: 99.99, rating: '4.8', reviews: '3,210', badge: 'Fan Favorite', description: 'Your everyday clean-air companion. A compact design and whisper-quiet operation bring fresh air to bedrooms, home offices, and the spaces you love most.' },
  { id: 'core-mini', name: 'Core® Mini-P Air Purifier', category: 'air', image: 'product-mini', price: 39.99, regular: 49.99, rating: '4.7', reviews: '1,960', badge: 'Small & Mighty', description: 'Big comfort for little spaces. This personal air purifier fits right into your nightstand or workspace, with simple controls and a compact footprint.' },
  { id: 'lv600s', name: 'LV600S Smart Hybrid Humidifier', category: 'humidifiers', image: 'product-humidifier', price: 98.99, regular: 109.99, rating: '4.6', reviews: '1,140', badge: 'Winter Essential', description: 'Find your ideal balance with warm and cool mist, smart humidity control, and a generous water tank. A simple way to make dry days a little more comfortable.' },
  { id: 'superior-studio', name: 'Superior® Studio Smart Humidifier', category: 'humidifiers', image: 'category-humidifier', price: 129.99, regular: 149.99, rating: '4.8', reviews: '324', badge: 'New Arrival', description: 'Meet natural humidification, made smart. Evaporative technology helps balance dry air without visible mist or white dust, in a design that feels at home anywhere.' },
  { id: 'windi-mini', name: 'Windi Mini Portable Desk Fan', category: 'fans', image: 'category-fan', price: 39.99, regular: 49.99, rating: '4.7', reviews: '286', badge: 'A Fresh Breeze', description: 'Your perfect little breeze, wherever the day takes you. A portable desk companion with a compact design and easy controls for personalized comfort.' },
  { id: 'eleva-filter', name: 'Eleva™ 300X Replacement Filter', category: 'filters', image: 'category-filter', price: 39.99, regular: 49.99, rating: '4.9', reviews: '168', badge: 'Genuine atohome', description: 'Keep your fresh-air routine going. A genuine atohome replacement filter designed for the Eleva 300X, with a snug fit and straightforward installation.' },
  { id: 'eleva-300x', name: 'Eleva™ 300X Smart Air Purifier', category: 'air', image: 'category-air', price: 199.99, regular: 249.99, rating: '4.8', reviews: '426', badge: 'Smart Comfort', description: 'Thoughtful air care for your everyday. Advanced filtration and smart sensing come together in a refined design, giving your home a little more peace of mind.' },
  { id: 'vortexiq-pro', name: 'VortexIQ® Pro Cordless Vacuum', category: 'vacuums', image: 'category-vacuum', price: 249.99, regular: 299.99, rating: '4.7', reviews: '392', badge: 'Powerfully Simple', description: 'From the first crumb to the last corner, enjoy powerful cordless cleaning with a versatile design that moves easily between floors and everyday messes.' },
];

const categoryNames = { all: 'Shop All', air: 'Air Purifiers', vacuums: 'Vacuums', humidifiers: 'Humidifiers', fans: 'Fans', filters: 'Filters & Accessories', favorites: 'Your Favorites' };
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
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
    showToast('Saved bag could not be loaded. A new bag is ready for this visit.');
  }
}

function persistState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ cart: state.cart, favorites: state.favorites }));
  } catch (error) {
    console.warn('Could not save storefront preview data:', error);
    showToast('Your browser could not save this bag. It is available for this visit only.');
    return false;
  }
  return true;
}

function productCard(product) {
  const favorite = state.favorites.includes(product.id);
  return `<article class="product-card">
    <span class="product-badge">${product.badge}</span>
    <button class="icon-button favorite-button" data-favorite="${product.id}" aria-label="${favorite ? 'Remove' : 'Save'} ${product.name} ${favorite ? 'from' : 'to'} favorites" aria-pressed="${favorite}">${icon('heart')}</button>
    <button class="product-image-button" data-product="${product.id}" aria-label="View ${product.name}"><img src="assets/${product.image}.webp" alt="${product.name}" width="600" height="600" loading="lazy"></button>
    <div class="product-card-copy"><p class="product-rating"><span class="sr-only">Rated ${product.rating} out of 5, </span><span aria-hidden="true">★★★★★</span><span>${product.rating} (${product.reviews})</span></p><button class="product-title" data-product="${product.id}">${product.name}</button><p class="product-prices">${money(product.price)} <del>${money(product.regular)}</del></p><button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag">Add to Bag ${icon('plus')}</button></div>
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
  document.querySelector('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'product' : 'products'}${state.query ? ' found' : ' to make yourself at home'}`;
  document.querySelector('#no-results').hidden = matches.length !== 0;
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === state.category)));
}

function closeMobileMenu() {
  document.querySelector('#mobile-menu').hidden = true;
  document.querySelector('#mobile-menu-toggle').setAttribute('aria-expanded', 'false');
  document.querySelector('#mobile-menu-toggle').setAttribute('aria-label', 'Open navigation');
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
  document.querySelector('#product-detail').innerHTML = `<div class="detail-layout"><div class="detail-image"><img src="assets/${product.image}.webp" alt="${product.name}" width="600" height="600"></div><div class="detail-copy"><span class="section-kicker">${product.badge.toUpperCase()}</span><h2 id="detail-title">${product.name}</h2><p class="product-rating"><span aria-hidden="true">★★★★★</span><span> ${product.rating} · ${product.reviews} reviews</span></p><p class="detail-description">${product.description}</p><p class="product-prices">${money(product.price)} <del>${money(product.regular)}</del></p><button class="button button-primary" data-add="${product.id}">Add to Bag ${icon('bag')}</button><p class="detail-features">${icon('shield')} Free shipping · 2-year warranty · 30-day returns</p></div></div>`;
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
  document.querySelector('[data-cart]').setAttribute('aria-label', `Open shopping bag, ${quantity} ${quantity === 1 ? 'item' : 'items'}`);
}

function addToCart(id) {
  const product = productById.get(id);
  if (!product) return;
  const row = state.cart.find(item => item.id === id);
  if (row && row.quantity === 99) {
    showToast('You can add up to 99 of each item.');
    return;
  }
  if (row) row.quantity += 1;
  else state.cart.push({ id, quantity: 1 });
  updateBagCount();
  if (persistState()) showToast(`${product.name} added to your bag`);
  if (cartDialog.open) renderCart();
}

function renderCart() {
  const container = document.querySelector('#cart-items');
  document.querySelector('#bag-quantity').textContent = `(${cartQuantity()})`;
  document.querySelector('#cart-summary').hidden = state.cart.length === 0;
  document.querySelector('#checkout-note').hidden = true;
  if (!state.cart.length) {
    container.innerHTML = `<div class="cart-empty">${icon('bag')}<h3>A little room for comfort.</h3><p>Your bag is empty. Let’s find your new favorite.</p><button class="button button-primary" data-shop="all">Explore the Collection ${icon('arrow')}</button></div>`;
    return;
  }
  container.innerHTML = state.cart.map(row => {
    const product = productById.get(row.id);
    return `<article class="cart-row"><img src="assets/${product.image}.webp" alt="${product.name}" width="90" height="100"><div><h3>${product.name}</h3><p class="cart-row-price">${money(product.price)}</p><div class="cart-row-bottom"><div class="quantity-control"><button data-quantity="${row.id}" data-change="-1" aria-label="Decrease quantity of ${product.name}">${icon('minus')}</button><span aria-label="Quantity">${row.quantity}</span><button data-quantity="${row.id}" data-change="1" aria-label="Increase quantity of ${product.name}" ${row.quantity >= 99 ? 'disabled' : ''}>${icon('plus')}</button></div><button class="remove-item" data-remove="${row.id}" aria-label="Remove ${product.name}">Remove</button></div></div></article>`;
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
  if (persistState()) showToast(wasSaved ? 'Removed from your favorites.' : 'Saved to your favorites. Find it under View All → Favorites.');
  // Update in place so keyboard focus stays on the button that was pressed.
  document.querySelectorAll('[data-favorite]').forEach(button => {
    if (button.dataset.favorite !== id) return;
    button.setAttribute('aria-pressed', String(!wasSaved));
    button.setAttribute('aria-label', `${wasSaved ? 'Save' : 'Remove'} ${productById.get(id).name} ${wasSaved ? 'to' : 'from'} favorites`);
  });
  if (state.category === 'favorites' && shopDialog.open) renderShop();
}

const infoContent = {
  support: ['atohome Support', 'This storefront preview does not have a connected support service. Contact details can be added when the atohome store launches.'],
  about: ['About atohome', 'A little more comfort, every day. Explore the atohome storefront preview to discover air care and home essentials.'],
  manuals: ['atohome User Manuals', 'Product manuals have not been added to this storefront preview.'],
  social: ['Connect with atohome', 'Social profiles for atohome have not been connected to this storefront preview.'],
  regions: ['atohome Around the World', 'Regional storefronts for atohome have not been connected to this preview.'],
  account: ['Make yourself at home.', 'This is an independent storefront preview. Account sign-in is not connected. You can explore products, save favorites, and keep a shopping bag in this browser.'],
  shipping: ['A little more peace of mind.', 'The reference store advertises free shipping on eligible orders. This preview does not accept orders or calculate shipping. Shipping policies for atohome have not been configured in this preview.'],
  returns: ['Comfort, with confidence.', 'The reference store advertises a 2-year limited warranty and 30-day returns. This preview does not process purchases or returns. Returns and warranty policies for atohome have not been configured in this preview.'],
  privacy: ['Your privacy matters.', 'This independent preview has no analytics or tracking scripts. Your shopping bag and favorites are stored only in this browser. Email addresses are not collected or submitted. Links to official sites open those sites with their own privacy policies.'],
  terms: ['About this storefront preview.', 'This is an independent recreation of the atohome homepage for demonstration. Brand names, product images, and reference copy belong to their respective owners. Product prices, ratings, and availability are illustrative and may change. No purchases, accounts, or email subscriptions are processed here.'],
};

function openInfo(key) {
  const [title, copy] = infoContent[key] || infoContent.terms;
  document.querySelector('#info-title').textContent = title;
  document.querySelector('#info-copy').textContent = copy;
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
cartDialog.setAttribute('aria-label', 'Your shopping bag');
infoDialog.setAttribute('aria-labelledby', 'info-title');

document.querySelectorAll('.newsletter-form').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const feedback = form.parentElement.querySelector('.form-feedback');
  feedback.textContent = 'This is a storefront preview. Your email has not been collected or submitted.';
}));

document.querySelector('#checkout-button').addEventListener('click', () => {
  document.querySelector('#checkout-note').hidden = false;
});

const mobileToggle = document.querySelector('#mobile-menu-toggle');
mobileToggle.addEventListener('click', () => {
  const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
  document.querySelector('#mobile-menu').hidden = isOpen;
  mobileToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
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
  pauseButton.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
  pauseButton.setAttribute('aria-pressed', String(userPaused));
  pauseButton.querySelector('span').textContent = userPaused ? '▷' : 'Ⅱ';
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

const techImages = [
  ['tech-filter', 'Replacing a atohome air purifier filter'],
  ['tech-vacuum', 'atohome hands-free auto-empty vacuum technology'],
  ['tech-quiet', 'atohome quiet operation technology for a peaceful home'],
  ['tech-smart', 'Smart home control with the VeSync app'],
];
document.querySelectorAll('[data-tech]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.tech);
  document.querySelectorAll('.tech-item').forEach((item, i) => {
    item.classList.toggle('is-active', i === index);
    item.querySelector('button').setAttribute('aria-expanded', String(i === index));
    item.querySelector('button span').textContent = i === index ? '−' : '+';
    item.querySelector('p').hidden = i !== index;
  });
  const image = document.querySelector('#technology-image');
  image.src = `assets/${techImages[index][0]}.webp`;
  image.alt = techImages[index][1];
}));

const promotionEnd = new Date('2026-12-01T00:00:00-08:00').getTime();
function updateCountdown() {
  const remaining = Math.max(0, Math.floor((promotionEnd - Date.now()) / 1000));
  const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((unit, i) => {
    document.querySelector(`#count-${unit}`).textContent = String(values[i]).padStart(2, '0');
  });
  if (remaining === 0) {
    document.querySelector('#promo-title').textContent = 'More Comfort. Every Season.';
    document.querySelector('.promo-banner>p').textContent = 'The Black Friday event has ended. Explore everyday essentials for a more comfortable home.';
    document.querySelector('.promo-banner>.button').innerHTML = `Explore the Collection ${icon('arrow')}`;
  }
}

restoreState();
renderTrending();
updateBagCount();
updateCountdown();
setInterval(updateCountdown, 1000);
