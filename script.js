/* =============================================
   AquaPure RO - script.js
   ============================================= */

// =============================================
//  PRODUCTS DATA
// =============================================
const products = [
  {
    id: 1,
    name: 'AquaPure Basic 7L',
    cat: 'ro',
    emoji: '💧',
    badge: 'Popular',
    price: 3999,
    oldPrice: 5500,
    rating: 4.2,
    reviews: 180,
    stages: 5,
    liters: 7
  },
  {
    id: 2,
    name: 'AquaPure Pro 9L',
    cat: 'ro',
    emoji: '🌊',
    badge: 'Best Seller',
    price: 6499,
    oldPrice: 8999,
    rating: 4.8,
    reviews: 342,
    stages: 7,
    liters: 9
  },
  {
    id: 3,
    name: 'AquaPure Smart 12L',
    cat: 'uv',
    emoji: '✨',
    badge: 'New',
    price: 9999,
    oldPrice: 13000,
    rating: 4.9,
    reviews: 87,
    stages: 9,
    liters: 12
  },
  {
    id: 4,
    name: 'UV Guard Pro',
    cat: 'uv',
    emoji: '☀️',
    badge: 'Offer',
    price: 7499,
    oldPrice: 10000,
    rating: 4.5,
    reviews: 215,
    stages: 8,
    liters: 10
  },
  {
    id: 5,
    name: 'Commercial RO 50LPH',
    cat: 'commercial',
    emoji: '🏭',
    badge: 'Commercial',
    price: 18999,
    oldPrice: 24000,
    rating: 4.7,
    reviews: 56,
    stages: 8,
    liters: 50
  },
  {
    id: 6,
    name: 'Industrial 100LPH',
    cat: 'commercial',
    emoji: '🏗️',
    badge: 'Industrial',
    price: 34999,
    oldPrice: 45000,
    rating: 4.6,
    reviews: 28,
    stages: 10,
    liters: 100
  },
  {
    id: 7,
    name: 'Sediment Filter 10"',
    cat: 'spares',
    emoji: '🔘',
    badge: 'Spare',
    price: 149,
    oldPrice: 200,
    rating: 4.3,
    reviews: 520,
    stages: null,
    liters: null
  },
  {
    id: 8,
    name: 'RO Membrane 75GPD',
    cat: 'spares',
    emoji: '🔵',
    badge: 'Spare',
    price: 799,
    oldPrice: 1100,
    rating: 4.6,
    reviews: 380,
    stages: null,
    liters: null
  }
];

// =============================================
//  CART STATE
// =============================================
let cart = [];

// =============================================
//  RENDER PRODUCTS
// =============================================

/**
 * Build star rating string
 * @param {number} rating
 * @returns {string}
 */
function buildStars(rating) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

/**
 * Render product cards into #productsGrid
 * @param {string} filter - category filter ('all' | 'ro' | 'uv' | 'commercial' | 'spares')
 */
function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.cat === filter);

  grid.innerHTML = filtered.map(p => {
    const discount = Math.round((1 - p.price / p.oldPrice) * 100);
    const metaLine = p.stages
      ? `${p.stages}-Stage Filter · ${p.liters}L Storage`
      : 'Genuine Spare Part · Fast Delivery';

    return `
      <div class="product-card" data-cat="${p.cat}">
        <div class="product-img">
          <span style="font-size:3.5rem">${p.emoji}</span>
          <span class="product-badge ${p.badge === 'Offer' ? 'offer' : ''}">${p.badge}</span>
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="product-meta">
            <span class="stars">${buildStars(p.rating)}</span>
            ${p.rating} (${p.reviews} reviews)
          </div>
          <div class="product-meta">${metaLine}</div>
          <div class="price-row">
            <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
            <span class="price-old">₹${p.oldPrice.toLocaleString('en-IN')}</span>
            <span class="price-off">${discount}% off</span>
          </div>
          <div class="product-actions">
            <button class="btn-add" onclick="addToCart(${p.id})">Add to Cart</button>
            <button class="btn-wish" onclick="showToast('Added to wishlist ❤️')">♡</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Filter products by category tab
 * @param {string} cat
 * @param {HTMLElement} btn
 */
function filterProducts(cat, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// =============================================
//  CART FUNCTIONS
// =============================================

/**
 * Add a product to the cart
 * @param {number} id - product id
 */
function addToCart(id) {
  const product  = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`${product.name} added to cart 🛒`);
}

/**
 * Remove a product from the cart
 * @param {number} id
 */
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

/**
 * Change item quantity (+1 or -1)
 * @param {number} id
 * @param {number} delta
 */
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCartUI();
  }
}

/**
 * Rebuild cart UI (count badge, item list, total)
 */
function updateCartUI() {
  const count = cart.reduce((acc, c) => acc + c.qty, 0);
  const total = cart.reduce((acc, c) => acc + c.price * c.qty, 0);

  // Update navbar badge
  document.getElementById('cartCount').textContent = count;

  // Update total
  document.getElementById('cartTotal').textContent =
    '₹' + total.toLocaleString('en-IN');

  // Render items
  const itemsEl = document.getElementById('cartItems');
  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty.<br/>Add products to get started.</p>
      </div>
    `;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
        </div>
      </div>
      <div class="cart-price-block">
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <button class="cart-remove" onclick="removeFromCart(${item.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

/**
 * Toggle cart drawer open/close
 */
function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

/**
 * Simulate checkout
 */
function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  const total = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  showToast(`Order of ₹${total.toLocaleString('en-IN')} placed! We'll call you shortly. 🎉`);

  cart = [];
  updateCartUI();
  toggleCart();
}

// =============================================
//  BOOKING FORM
// =============================================

/**
 * Pre-fill service select and scroll to booking section
 * @param {string} service - service name to pre-fill
 */
function bookService(service) {
  const select = document.getElementById('fservice');
  // Try to match option text
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].text.includes(service.split(' (')[0])) {
      select.selectedIndex = i;
      break;
    }
  }
  document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Validate and submit the booking form
 */
function submitBooking() {
  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const address = document.getElementById('faddress').value.trim();
  const service = document.getElementById('fservice').value;

  if (!name || !phone || !address || !service) {
    showToast('Please fill all required fields ⚠️');
    return;
  }

  if (!/^\+?[\d\s\-]{8,15}$/.test(phone)) {
    showToast('Please enter a valid mobile number ⚠️');
    return;
  }

  showToast(`Booking confirmed for ${name}! We'll WhatsApp you shortly. 🎉`);

  // Reset form fields
  ['fname', 'fphone', 'femail', 'faddress', 'fmodel', 'fnotes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('fservice').value = '';
  document.getElementById('fdate').value = '';
}

// =============================================
//  TOAST NOTIFICATION
// =============================================

let toastTimer = null;

/**
 * Show a toast notification
 * @param {string} msg - message to display
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
//  MOBILE MENU
// =============================================

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/**
 * Close mobile menu (called on link click)
 */
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// =============================================
//  INITIALISE
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // Render all products on page load
  renderProducts('all');

  // Set minimum booking date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fdate').setAttribute('min', today);

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const nav  = document.querySelector('nav');
    if (menu.classList.contains('open') && !nav.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
});
