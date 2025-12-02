import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Cart.css";
import formatCurrency from "../utils/formatCurrency";

const LOCAL_KEY = "shopper_cart_v1";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // load from localStorage on mount
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (err) {
        console.error("Invalid cart in localStorage", err);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    // persist changes and notify rest of app
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: items }));
  }, [items]);

  const updateQty = (id, newQty) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, newQty) } : it))
    );
    setToast("Cart updated");
    hideToastAfter();
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setToast("Item removed");
    hideToastAfter();
  };

  const clearCart = () => {
    if (!window.confirm("Clear cart? This will remove all items.")) return;
    setItems([]);
    setToast("Cart cleared");
    hideToastAfter();
  };

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const tax = +(subtotal * 0.12).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const onCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  function hideToastAfter() {
    setTimeout(() => setToast(""), 1500);
  }

  if (items.length === 0) {
    return (
      <div className="cart-page cart-empty-page">
        <div className="cart-inner">
          <h2>Shopping Cart</h2>
          <div className="cart-empty-card">
            <svg width="120" height="90" viewBox="0 0 24 24" fill="none" className="empty-illustration">
              <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="#FF6B6B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="20" r="1.6" fill="#FF6B6B"/>
              <circle cx="18" cy="20" r="1.6" fill="#FF6B6B"/>
            </svg>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet. Start shopping to fill your cart!</p>
            <div className="cart-empty-actions">
              <Link to="/" className="btn-accent">Continue Shopping</Link>
              <button
                className="btn-ghost"
                onClick={() => {
                  // demo helper: add sample items to cart
                  const sample = [
                    { id: "p1", name: "Classic Shirt", price: 899, qty: 1, image: "" },
                    { id: "p2", name: "Sneakers", price: 2499, qty: 2, image: "" },
                  ];
                  setItems(sample);
                  setToast("Demo items added");
                  hideToastAfter();
                }}
              >
                Add demo items
              </button>
            </div>
          </div>
          {toast && <div className="cart-toast">{toast}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <h2>Shopping Cart</h2>

        <div className="cart-grid">
          <div className="cart-items">
            {items.map((it) => (
              <div className="cart-item" key={it.id}>
                <div className="cart-item-left">
                  <div className="cart-thumb">
                    {it.image ? (
                      <img src={it.image} alt={it.name} />
                    ) : (
                      <div className="cart-thumb-fallback">{it.name.charAt(0)}</div>
                    )}
                  </div>

                  <div className="cart-meta">
                    <div className="cart-name">{it.name}</div>
                    <div className="cart-price muted">{formatCurrency(it.price)}</div>

                    <div className="cart-controls-sm">
                      <div className="qty-control small">
                        <button onClick={() => updateQty(it.id, it.qty - 1)}>-</button>
                        <input
                          type="number"
                          min="1"
                          value={it.qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value || 1, 10);
                            updateQty(it.id, isNaN(val) ? 1 : val);
                          }}
                        />
                        <button onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                      </div>
                      <button className="link remove" onClick={() => removeItem(it.id)}>Remove</button>
                    </div>
                  </div>
                </div>

                <div className="cart-item-right">
                  <div className="qty-control">
                    <button onClick={() => updateQty(it.id, it.qty - 1)}>-</button>
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value || 1, 10);
                        updateQty(it.id, isNaN(val) ? 1 : val);
                      }}
                    />
                    <button onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                  </div>

                  <div className="item-total">{formatCurrency(it.price * it.qty)}</div>

                  <div className="cart-actions">
                    <button className="link remove" onClick={() => removeItem(it.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary sticky-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <button className="checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>

            <button className="clear-btn" onClick={clearCart}>Clear Cart</button>

            <Link to="/" className="btn-link secondary">Continue Shopping</Link>
          </aside>
        </div>

        {toast && <div className="cart-toast bottom">{toast}</div>}
      </div>
    </div>
  );
};

export default Cart;
