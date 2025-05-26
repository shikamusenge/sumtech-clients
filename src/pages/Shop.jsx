import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from 'react-toastify';
import { GridLoader } from 'react-spinners';
import { Heart, Eye } from 'lucide-react'; // Added Heart and Eye icons
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
      toast.info("Please login to add items to cart");
      return;
    }

    try {
      const response = await axios.post(CART_API_URL, {
        userId: user._id,
        productId,
        quantity: 1,
      });
      toast.success(`${products.find(p => p._id === productId)?.title || 'Item'} added to cart!`);
      setCart(response.data);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart");
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
      toast.error("Failed to update quantity");
    }
  };

  // Remove from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${CART_API_URL}/${user._id}/${productId}`);
      setCart(response.data);
      toast.success("Item removed from cart.");
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove item from cart");
    }
  };

  // Create order
  const handleCreateOrder = async () => {
    if (!user) {
      toast.info("Please login to create an order");
      return;
    }

    if (cart.items.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    setShowLocationModal(true);
  };

  const confirmOrderWithLocation = async () => {
    const googleMapsRegex = /^(https?:\/\/)?(www\.)?(google\.[a-z]+\/maps|maps\.google\.[a-z]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i;
    
    if (!deliveryLocation || !googleMapsRegex.test(deliveryLocation)) {
      toast.warn("Please provide a valid Google Maps link. Accepted formats:\n\n" +
            "- https://www.google.com/maps\n" +
            "- https://maps.google.com\n" +
            "- https://maps.app.goo.gl (short links)\n" +
            "- https://goo.gl/maps (short links)", { autoClose: 7000 });
      return;
    }

    if (!phoneNumber || phoneNumber.trim() === "") {
      toast.warn("Please provide a valid phone number");
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
      
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error("Failed to place order");
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <GridLoader color={'var(--accent)'} loading={true} size={25} margin={5}/>
        <p className="mt-4 text-lg text-muted">Loading Products...</p>
      </div>
    );
  }
  if (error) return <div className="flex justify-center items-center min-h-screen text-xl text-red-500"><p>{error}</p></div>; // Adjusted error state

  return (
    // Main container
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background text-foreground min-h-screen mt-8 sm:mt-12 md:mt-[35px]">
      {/* Header: Title, Search, Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl sm:text-4xl font-bold text-accent mb-4 sm:mb-0">Our Products</h1>
        
        <div className="relative flex-grow w-full sm:w-auto sm:max-w-md lg:max-w-lg mb-4 sm:mb-0 sm:mx-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-background border border-border rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-primary-lighter cursor-pointer transition-colors duration-200 ease-in-out"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            className="px-3 py-2 sm:px-4 sm:py-2.5 bg-primary text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 font-semibold transition-colors"
            onClick={() => setShowOrders(!showOrders)}
          >
            My Orders
          </button>
          <div className="relative cursor-pointer" onClick={() => setShowCart(!showCart)}>
            <span className="text-2xl sm:text-3xl text-accent">🛒</span> 
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 sm:-right-3 bg-accent text-background text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className={`fixed top-0 right-0 w-full max-w-sm sm:max-w-md h-full bg-background shadow-xl z-[100] flex flex-col transition-transform duration-300 ease-in-out ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-5 border-b border-border bg-gray-100 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-accent">Your Cart</h3>
            <button onClick={() => setShowCart(false)} className="text-foreground hover:text-accent text-2xl">&times;</button>
          </div>
          {cart.items.length > 0 ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.product} className="flex items-center gap-4 pb-4 border-b border-border last:border-b-0 relative">
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                      <img 
                        src={`http://localhost:5000${item.images[0]}`} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md font-semibold text-accent mb-1 truncate" title={item.title}>{item.title}</h4>
                      <p className="text-foreground font-bold mb-2">RWF {item.price}</p>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                      className="w-8 h-8 border border-border bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-foreground transition-colors duration-200 ease-in-out"
                        >
                          -
                        </button>
                        <span className="min-w-[20px] text-center text-foreground font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                      className="w-8 h-8 border border-border bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-foreground transition-colors duration-200 ease-in-out"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.product)}
                  className="absolute top-1 right-1 text-muted hover:text-red-500 text-xl p-1 transition-colors duration-200 ease-in-out"
                      aria-label="Remove item"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-border bg-gray-100 dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4 text-lg font-bold text-accent">
                  <span>Total:</span>
                  <span>RWF {totalAmount}</span>
                </div>
                <button 
                  className="w-full py-3 bg-accent text-background rounded-lg font-bold hover:bg-accent-dark transition-colors"
                  onClick={handleCreateOrder}
                >
                  Order Now
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              {/* Using an indicative icon from lucide-react if available, or text */}
              {/* <ShoppingCart size={48} className="text-muted mb-4" /> */}
              <span className="text-4xl mb-4" role="img" aria-label="Empty Cart">🛒</span>
              <p className="text-muted">Your cart is empty.</p>
            </div>
          )}
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[110] p-4">
          <div className="bg-background p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-accent">
            <h3 className="text-xl sm:text-2xl font-semibold text-accent mb-4">Enter Delivery Information</h3>
            <p className="text-sm text-muted mb-1">Please provide a Google Maps link for delivery.</p>
            <ul className="text-xs text-muted list-disc list-inside mb-4 space-y-1">
              <li>https://www.google.com/maps...</li>
              <li>https://maps.google.com...</li>
              <li>https://maps.app.goo.gl/... (short links)</li>
              <li>https://goo.gl/maps/... (short links)</li>
            </ul>
            <input
              type="text"
              placeholder="Paste your Google Maps link here"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg border border-border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted mb-1" htmlFor="phoneNumberModalLocation">Phone Number:</label>
              <input
                id="phoneNumberModalLocation"
                type="tel"
                placeholder="Your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowLocationModal(false)}
                className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-foreground font-semibold transition-colors duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button 
                onClick={confirmOrderWithLocation}
                className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-background font-semibold transition-colors duration-200 ease-in-out"
              >
                Confirm Order
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-sm text-muted">
              <p className="font-semibold mb-2">How to get your Google Maps link:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline transition-colors duration-200 ease-in-out">Google Maps</a></li>
                <li>Search for your delivery location</li>
                <li>Click "Share" → "Copy link"</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Orders Drawer */}
      {showOrders && (
         <div className={`fixed top-0 right-0 w-full max-w-sm sm:max-w-md md:max-w-lg h-full bg-background shadow-xl z-[100] flex flex-col transition-transform duration-300 ease-in-out ${showOrders ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-5 border-b border-border bg-gray-100 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-accent">Your Orders</h3>
            <button onClick={() => setShowOrders(false)} className="text-foreground hover:text-accent text-2xl">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="border border-border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center font-bold mb-1 text-accent">
                    <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span>RWF {order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted mb-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-foreground mb-2">
                    <strong>Contact:</strong> {order.phoneNumber}
                  </div>
                  <div className="space-y-2 mt-3">
                    {order.items.map((item, index) => (
                      <div key={`${item.product}-${index}`} className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                          <img 
                            src={`http://localhost:5000${item.images[0]}`} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-accent truncate" title={item.title}>{item.title}</h4>
                          <p className="text-xs text-muted">RWF {item.purchasedPrice || item.price} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm">
                    <strong className="text-accent">Delivery Location:</strong>{" "}
                    <a href={order.deliveryLocation} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline transition-colors duration-200 ease-in-out">
                      View on Google Maps
                    </a>
                  </div>
                  <div className="mt-2 text-sm">
                    <strong className="text-accent">Status:</strong> <span className={`font-semibold ${
                      order.status === 'pending' ? 'text-yellow-500' :
                      order.status === 'processing' ? 'text-blue-500' :
                      order.status === 'shipped' ? 'text-purple-500' :
                      order.status === 'delivered' ? 'text-green-500' :
                      order.status === 'cancelled' ? 'text-red-500' : 'text-foreground'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted">You haven't placed any orders yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[1000] p-4" onClick={closeImageModal}>
          <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 sm:top-0 sm:-right-12 text-white hover:text-accent text-3xl sm:text-4xl z-[1001]" onClick={closeImageModal} aria-label="Close image modal">
              &times;
            </button>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10} 
              slidesPerView={1}
              initialSlide={clickedImageIndex}
              className="h-auto max-h-[80vh] rounded-lg overflow-hidden modal-swiper" // Added modal-swiper for specific overrides
            >
              {currentProductImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-contain max-h-[80vh]"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl group border-t-4 border-transparent hover:border-accent">
              <div className="h-52 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="h-full product-card-swiper" // Added a class for potential specific Swiper CSS overrides
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`${product.title} ${index + 1}`}
                        onClick={() => openImageModal(product.images, index)}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-accent mb-2 truncate" title={product.title}>{product.title}</h3>
                <p className="text-sm text-muted mb-3 h-10 overflow-hidden text-ellipsis">{product.description}</p>
                <p className="text-xl font-bold text-accent mb-4">RWF {product.price}</p>
                {isInCart(product._id) ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) - 1)}
                      disabled={getCartQuantity(product._id) <= 1}
                      className="w-10 h-10 border border-border bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-foreground transition-colors duration-200 ease-in-out"
                    >
                      -
                    </button>
                    <span className="min-w-[24px] text-center font-semibold text-foreground">{getCartQuantity(product._id)}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) + 1)}
                      className="w-10 h-10 border border-border bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-foreground transition-colors duration-200 ease-in-out"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    className="w-full py-2.5 bg-accent text-background rounded-lg font-bold hover:bg-accent-dark transition-colors duration-200 ease-in-out"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted text-lg">No products found matching your search.</div>
        )}
      </div>
    </div>
  );
}

export default Shop;