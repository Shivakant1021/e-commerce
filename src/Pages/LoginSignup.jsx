import React from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Sign Up</h1>

        <form className="loginsignup-form" onSubmit={(e) => e.preventDefault()}>
          <div className="loginsignup-fields">
            <input type="text" name="name" placeholder="Your Name" />
            <input type="email" name="email" placeholder="email@xyz.com" />
            <input type="password" name="password" placeholder="Password" />
          </div>

          <button type="submit" className="primary-btn">Continue</button>

          <p className="loginsignup-login">
            Already have an account? <span className="login-link">Login here</span>
          </p>

          <label className="loginsignup-agree">
            <input type="checkbox" name="agree" />
            <span>By continuing, I agree to the terms of use &amp; privacy policy.</span>
          </label>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
