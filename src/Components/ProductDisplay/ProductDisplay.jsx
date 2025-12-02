// src/Components/ProductDisplay/ProductDisplay.jsx
import { useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { addToCart } from "../../utils/cartUtils";

const ProductDisplay = (props) => {
  const { product } = props;
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  // Normalize product id/price (your product object might use different keys)
  const productId = product.id || product._id || product.productId || `${product.name}`; 
  const productPrice = Number(product.new_price ?? product.price ?? 0);

  const handleAddToCart = () => {
    // optionally require size selection if you want:
    // if (!selectedSize) { alert("Please select a size"); return; }

    const prod = {
      id: productId,
      name: product.name,
      price: productPrice,
      image: product.image,
      size: selectedSize,
    };

    try {
      addToCart(prod, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); // hide message after 2s
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            ${product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          Shoppers brings you the latest trends in fashion with premium-quality
          clothing for all ages. From casual wear to party outfits, we blend
          comfort with modern style. Discover timeless designs that make you
          look confident every day.
        </div>

        <div className="productdisplay-right-size">
          <h2>Select Size</h2>
          <div className="productdisplay-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <div
                key={s}
                className={`size-item ${selectedSize === s ? "selected" : ""}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          ADD TO CART
        </button>

        {added && <div className="added-toast">Added to cart ✓</div>}

        <p className="productdisplay-right-category">
          <span>Category :</span>Women, T-shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Category :</span>Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
