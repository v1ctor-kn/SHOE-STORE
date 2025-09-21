function addToCart(productName) {
  alert(productName + " added to cart!");
}

// New cart functionality
const CART_STORAGE_KEY = "shoe_store_cart";
let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productName, price = 0) {
  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: productName, price: Number(price) || 0, qty: 1 });
  }
  saveCart();
  // keep the old alert behavior for quick feedback
  alert(productName + " added to cart!");
}

function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  saveCart();
}

function changeQty(productName, qty) {
  const item = cart.find(i => i.name === productName);
  if (!item) return;
  item.qty = Math.max(0, Number(qty) || 0);
  if (item.qty === 0) removeFromCart(productName);
  else saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    el.textContent = count;
  }
}

function renderCart(containerId) {
  const container = document.getElementById(containerId || "cart");
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }
  const rows = cart.map(item => `
    <div class="cart-item">
      <strong>${item.name}</strong>
      <span> quantity: <input type="number" value="${item.qty}" min="0" data-name="${item.name}" class="cart-qty"></span>
      <span> price: $${(item.price||0).toFixed(2)}</span>
      <button data-name="${item.name}" class="cart-remove">Remove</button>
    </div>
  `).join("");
  const total = `<div class="cart-total">Total: $${getCartTotal().toFixed(2)}</div>`;
  container.innerHTML = rows + total;

  // attach handlers for inputs/buttons
  container.querySelectorAll(".cart-remove").forEach(btn =>
    btn.addEventListener("click", e => removeFromCart(e.currentTarget.dataset.name))
  );
  container.querySelectorAll(".cart-qty").forEach(input =>
    input.addEventListener("change", e => changeQty(e.currentTarget.dataset.name, e.currentTarget.value))
  );
}

// expose helpers for console or other scripts
window.cartHelpers = {
  addToCart,
  removeFromCart,
  changeQty,
  clearCart,
  getCartTotal,
  renderCart,
  cart
};

// initialize UI count on load
document.addEventListener("DOMContentLoaded", updateCartCount);

