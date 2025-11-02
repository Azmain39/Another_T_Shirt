/*
 * script.js
 * Handles product rendering and cart functionality using localStorage.
 */

// Define our products. In a real application this would come from a server or database.
const PRODUCTS = [
  {
    id: 1,
    name: 'Geometric Art Tee',
    price: 25.00,
    image: 'assets/tshirt1.png'
  },
  {
    id: 2,
    name: 'Golden Elegance Tee',
    price: 32.00,
    image: 'assets/tshirt2.png'
  },
  {
    id: 3,
    name: 'Sunset Peaks Tee',
    price: 28.00,
    image: 'assets/tshirt3.png'
  },
  {
    id: 4,
    name: 'Futuristic Red Tee',
    price: 30.00,
    image: 'assets/tshirt4.png'
  }
];

// Utility functions for managing the cart in localStorage
const getCart = () => {
  const cartJson = localStorage.getItem('cart');
  return cartJson ? JSON.parse(cartJson) : [];
};

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const updateCartCount = () => {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const countElem = document.getElementById('cart-count');
  if (countElem) countElem.textContent = count;
};

const addToCart = (productId) => {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert(`Added ${product.name} to cart.`);
};

// Render products on the homepage
const renderProducts = () => {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  PRODUCTS.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.className = 'product-image';
    card.appendChild(img);

    const details = document.createElement('div');
    details.className = 'product-details';

    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = product.name;
    details.appendChild(name);

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = `$${product.price.toFixed(2)}`;
    details.appendChild(price);

    const button = document.createElement('button');
    button.textContent = 'Add to Cart';
    button.addEventListener('click', () => addToCart(product.id));
    details.appendChild(button);

    card.appendChild(details);
    grid.appendChild(card);
  });
};

// Render cart on cart.html
const renderCart = () => {
  const cartTableBody = document.getElementById('cart-items');
  const summaryTotal = document.getElementById('summary-total');
  if (!cartTableBody || !summaryTotal) return;
  const cart = getCart();
  cartTableBody.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;
    total += product.price * item.quantity;
    const row = document.createElement('tr');

    // Image cell
    const imgTd = document.createElement('td');
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    imgTd.appendChild(img);
    row.appendChild(imgTd);

    // Name cell
    const nameTd = document.createElement('td');
    nameTd.textContent = product.name;
    row.appendChild(nameTd);

    // Price cell
    const priceTd = document.createElement('td');
    priceTd.textContent = `$${product.price.toFixed(2)}`;
    row.appendChild(priceTd);

    // Quantity cell with controls
    const qtyTd = document.createElement('td');
    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    const decBtn = document.createElement('button');
    decBtn.textContent = '-';
    decBtn.addEventListener('click', () => {
      changeQuantity(item.id, -1);
    });
    const qtySpan = document.createElement('span');
    qtySpan.textContent = item.quantity;
    const incBtn = document.createElement('button');
    incBtn.textContent = '+';
    incBtn.addEventListener('click', () => {
      changeQuantity(item.id, 1);
    });
    controls.appendChild(decBtn);
    controls.appendChild(qtySpan);
    controls.appendChild(incBtn);
    qtyTd.appendChild(controls);
    row.appendChild(qtyTd);

    // Subtotal cell
    const subtotalTd = document.createElement('td');
    subtotalTd.textContent = `$${(product.price * item.quantity).toFixed(2)}`;
    row.appendChild(subtotalTd);

    // Remove cell
    const removeTd = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn-remove';
    removeBtn.style.backgroundColor = '#e53935';
    removeBtn.style.color = '#fff';
    removeBtn.style.border = 'none';
    removeBtn.style.padding = '6px 10px';
    removeBtn.style.borderRadius = '4px';
    removeBtn.style.cursor = 'pointer';
    removeBtn.addEventListener('click', () => {
      removeItem(item.id);
    });
    removeTd.appendChild(removeBtn);
    row.appendChild(removeTd);

    cartTableBody.appendChild(row);
  });
  summaryTotal.textContent = `$${total.toFixed(2)}`;
  updateCartCount();
};

// Change quantity of a cart item
const changeQuantity = (productId, delta) => {
  const cart = getCart();
  const item = cart.find(ci => ci.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    // Remove item if quantity goes to zero
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }
  saveCart(cart);
  renderCart();
};

// Remove an item from cart
const removeItem = (productId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== productId);
  saveCart(newCart);
  renderCart();
};

// Initialize page-specific scripts
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
  // Determine which page we're on
  if (document.getElementById('product-grid')) {
    renderProducts();
    updateCartCount();
  }
  if (document.getElementById('cart-items')) {
    renderCart();
  }
});