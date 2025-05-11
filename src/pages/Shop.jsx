import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/Shop.css";
import { BASE_URL } from "../utils/server";

const API_URL = `${BASE_URL}/api/products`;
const CART_API_URL = `${BASE_URL}/api/cart`;
const ORDERS_API_URL = `${BASE_URL}/api/orders`;
const POLL_INTERVAL = 5000; // 5 seconds

function Shop() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cart, setCart] = useState({ items: [] });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);
  const [currentProductImages, setCurrentProductImages] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const openImageModal = (images, index) => {
    setCurrentProductImages(images);
    setClickedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // Combined data fetching function
  const fetchAllData = useCallback(async () => {
    try {
      // Fetch products
      const productsRes = await axios.get(API_URL);
      setProducts(productsRes.data);
      
      // Apply current search filter
      if (searchTerm.trim() === "") {
        setFilteredProducts(productsRes.data);
      } else {
        setFilteredProducts(
          productsRes.data.filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      // Fetch user data if logged in
      if (user) {
        // Fetch cart
        const cartRes = await axios.get(`${CART_API_URL}/${user._id}`);
        setCart(cartRes.data || { items: [] });
        
        // Update phone number if not set
        if (!phoneNumber && user.phoneNumber) {
          setPhoneNumber(user.phoneNumber);
        }
        
        // Fetch orders
        const ordersRes = await axios.get(`${ORDERS_API_URL}/${user._id}`);
        setOrders(ordersRes.data);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
      setIsLoading(false);
    }
  }, [user, searchTerm, phoneNumber]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(Date.now());
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Respond to polling updates
  useEffect(() => {
    fetchAllData();
  }, [lastUpdated, fetchAllData]);

  // Handle search and suggestions
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);

    // Generate suggestions
    const productTitles = products.map((product) => product.title);
    const matchedSuggestions = productTitles.filter((title) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSuggestions(matchedSuggestions.slice(0, 5));
  }, [searchTerm, products]);

  // Add to cart
  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await axios.post(CART_API_URL, {
        userId: user._id,
        productId,
        quantity: 1,
      });

      setCart(response.data);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart");
    }
  };

  // Update cart item quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(`${CART_API_URL}/${user._id}/${productId}`, {
        quantity: newQuantity
      });
      setCart(response.data);
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    }
  };

  // Remove from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${CART_API_URL}/${user._id}/${productId}`);
      setCart(response.data);
    } catch (err) {
      console.error("Error removing from cart:", err);
      alert("Failed to remove item from cart");
    }
  };

  // Create order
  const handleCreateOrder = async () => {
    if (!user) {
      alert("Please login to create an order");
      return;
    }

    if (cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setShowLocationModal(true);
  };

  const confirmOrderWithLocation = async () => {
    const googleMapsRegex = /^(https?:\/\/)?(www\.)?(google\.[a-z]+\/maps|maps\.google\.[a-z]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i;
    
    if (!deliveryLocation || !googleMapsRegex.test(deliveryLocation)) {
      alert("Please provide a valid Google Maps link. Accepted formats:\n\n" +
            "- https://www.google.com/maps\n" +
            "- https://maps.google.com\n" +
            "- https://maps.app.goo.gl (short links)\n" +
            "- https://goo.gl/maps (short links)");
      return;
    }

    if (!phoneNumber || phoneNumber.trim() === "") {
      alert("Please provide a valid phone number");
      return;
    }

    try {
      const response = await axios.post(ORDERS_API_URL, {
        userId: user._id,
        cartId: cart._id,
        deliveryLocation,
        phoneNumber
      });
      
      // Clear the cart and location after successful order
      setCart({ items: [] });
      setDeliveryLocation("");
      setShowCart(false);
      setShowLocationModal(false);
      
      // Update orders list
      setOrders([response.data, ...orders]);
      
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to place order");
    }
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cart.items.some((item) => item.product.toString() === productId);
  };

  // Get quantity of item in cart
  const getCartQuantity = (productId) => {
    const item = cart.items.find((item) => item.product.toString() === productId);
    return item ? item.quantity : 0;
  };

  // Calculate total items in cart
  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total amount
  const totalAmount = cart.items.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  ).toFixed(2);

  if (isLoading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Our Products</h1>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="header-actions">
          <button 
            className="view-orders-btn"
            onClick={() => setShowOrders(!showOrders)}
          >
            My Orders
          </button>
          <div className="cart-info" onClick={() => setShowCart(!showCart)}>
            <span className="cart-icon">🛒 ({cartItemCount})</span>
          </div>
        </div>
      </div>

      {showCart && cart.items.length > 0 && (
        <div className="cart-drawer">
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button onClick={() => setShowCart(false)} className="close-cart">
              ×
            </button>
          </div>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={`http://localhost:5000${item.images[0]}`} 
                    alt={item.title}
                  />
                </div>
                <div className="cart-item-details">
                  <h4>{item.title}</h4>
                  <p>RWF {item.price}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveFromCart(item.product)}
                  className="remove-item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>RWF {totalAmount}</span>
            </div>
            <button className="order-now-btn" onClick={handleCreateOrder}>
              Order Now
            </button>
          </div>
        </div>
      )}

      {showLocationModal && (
        <div className="modal-overlay">
          <div className="location-modal">
            <h3>Enter Delivery Information</h3>
            <p>Please provide a Google Maps link for delivery. Accepted formats:</p>
            <ul className="accepted-formats">
              <li>https://www.google.com/maps</li>
              <li>https://maps.google.com</li>
              <li>https://maps.app.goo.gl (short links)</li>
              <li>https://goo.gl/maps (short links)</li>
            </ul>
            <input
              type="text"
              placeholder="Paste your Google Maps link here"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
            />
            
            <div className="phone-input">
              <label>Phone Number:</label>
              <input
                type="tel"
                placeholder="Your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="modal-buttons">
              <button onClick={() => setShowLocationModal(false)}>Cancel</button>
              <button onClick={confirmOrderWithLocation}>Confirm Order</button>
            </div>
            
            <div className="map-instructions">
              <p>How to get your Google Maps link:</p>
              <ol>
                <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a></li>
                <li>Search for your delivery location</li>
                <li>Click "Share" → "Copy link"</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {showOrders && (
        <div className="orders-drawer">
          <div className="orders-header">
            <h3>Your Orders</h3>
            <button onClick={() => setShowOrders(false)} className="close-orders">
              ×
            </button>
          </div>
          <div className="orders-list">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-header">
                    <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span>RWF {order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div className="order-contact">
                    <strong>Contact:</strong> {order.phoneNumber}
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={`${item.product}-${index}`} className="order-product">
                        <div className="order-product-image">
                          <img 
                            src={`http://localhost:5000${item.images[0]}`} 
                            alt={item.title}
                          />
                        </div>
                        <div className="order-product-details">
                          <h4>{item.title}</h4>
                          <p>RWF {item.purchasedPrice || item.price} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-delivery">
                    <strong>Delivery Location:</strong>{" "}
                    <a href={order.deliveryLocation} target="_blank" rel="noopener noreferrer">
                      View on Google Maps
                    </a>
                  </div>
                  <div className="order-status">
                    Status: <span className={`status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-orders">You haven't placed any orders yet.</div>
            )}
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeImageModal}>
              ×
            </button>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              initialSlide={clickedImageIndex}
              className="modal-swiper"
            >
              {currentProductImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Product image ${index + 1}`}
                    className="modal-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={10}
                  slidesPerView={1}
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`${product.title} ${index + 1}`}
                        onClick={() => openImageModal(product.images, index)}
                        className="product-thumbnail"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="product-details">
                <h3>{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">RWF {product.price}</p>
                {isInCart(product._id) ? (
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) - 1)}
                      disabled={getCartQuantity(product._id) <= 1}
                    >
                      -
                    </button>
                    <span>{getCartQuantity(product._id)}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) + 1)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No products found matching your search.</div>
        )}
      </div>
    </div>
  );
}

export default Shop;