// src/utils/cartUtils.js
const LOCAL_KEY = "shopper_cart_v1";

/**
 * Cart item shape:
 * { id, name, price (number), qty (number), image (string), size?: string }
 */

export function getCart() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read cart from localStorage", e);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
    // notify other parts of the app that cart changed
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }
}

/**
 * Add product to cart. If product already exists (same id and size), increment qty.
 * productData should contain id, name, price (number), image (string), optional size
 */
export function addToCart(productData, quantity = 1) {
  if (!productData || !productData.id) {
    throw new Error("Product must have an id to add to cart");
  }

  const cart = getCart();

  // match by id + size (if size present)
  const matchIndex = cart.findIndex((it) => {
    if (it.id !== productData.id) return false;
    // if both have size, compare; if neither, treat as same
    if ((it.size || "") !== (productData.size || "")) return false;
    return true;
  });

  if (matchIndex >= 0) {
    cart[matchIndex].qty = Math.max(1, cart[matchIndex].qty + quantity);
  } else {
    const newItem = {
      id: productData.id,
      name: productData.name || productData.title || "Product",
      price: Number(productData.price) || 0,
      qty: Math.max(1, quantity),
      image: productData.image || "",
      size: productData.size || null,
    };
    cart.push(newItem);
  }

  saveCart(cart);
  return cart;
}

/** helper to clear cart (used for testing) */
export function clearCart() {
  saveCart([]);
}
