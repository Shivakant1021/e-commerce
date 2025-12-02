import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { getCart } from '../../utils/cartUtils';   // <-- IMPORT

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
      setCartCount(totalQty);
    };

    updateCount(); // initial render

    // Listen for updates from Product page or Cart page
    window.addEventListener("cartUpdated", updateCount);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt='' />
        <p>SHOPPERS</p>
      </div>

      <ul className='nav-menu'>
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>

        <li onClick={() => setMenu("mens")}>
          <Link style={{ textDecoration: 'none' }} to='/mens'>Men</Link>
          {menu === "mens" ? <hr /> : <></>}
        </li>

        <li onClick={() => setMenu("womens")}>
          <Link style={{ textDecoration: 'none' }} to='/womens'>Women</Link>
          {menu === "womens" ? <hr /> : <></>}
        </li>

        <li onClick={() => setMenu("kids")}>
          <Link style={{ textDecoration: 'none' }} to='/kids'>Kid</Link>
          {menu === "kids" ? <hr /> : <></>}
        </li>
      </ul>

      <div className="nav-login-cart">
        <Link to='/login'><button>Login</button></Link>

        <Link to='/cart'>
          <img src={cart_icon} alt="cart" />
        </Link>

        {/* CART COUNT BADGE */}
        <div className='nav-cart-count'>{cartCount}</div>
      </div>
    </div>
  );
};

export default Navbar;
