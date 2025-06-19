import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BASE_URL } from "../utils/server";
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiSearch, FiMapPin, FiPhone, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiOutlineExclamationCircle } from "react-icons/hi";

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
        ))
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
      setError("Failed to fetch data. Please try again later.");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-lg transform transition-all hover:scale-[1.01]">
          <HiOutlineExclamationCircle className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
          <h2 className="mt-4 text-xl font-bold text-red-600">Error Loading Products</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={fetchAllData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-20 transform transition-all duration-300 hover:shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Our Products
            </h1>
            
            <div className="relative flex-1 max-w-xl">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full ml-10 pl-20 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showOrders ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                onClick={() => setShowOrders(!showOrders)}
              >
                <span>My Orders</span>
              </button>
              <button 
                className={`relative p-2 rounded-full transition-all ${showCart ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                onClick={() => setShowCart(!showCart)}
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        <div className="grid grid-cols-1 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
  <div 
    key={product._id} 
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
  >
    {/* Discount Badge */}
    {product.discount > 0 && (
      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center">
        <span className="animate-pulse">🔥</span>
        <span className="ml-1">{product.discount}% OFF</span>
      </div>
    )}

    {/* Product Image */}
    <div className="relative h-48 overflow-hidden group">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: `.next-${product._id}`,
          prevEl: `.prev-${product._id}`,
        }}
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        className="h-full"
      >
        {product.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${image.url}`}
              alt={`${product.title} ${index + 1}`}
              onClick={() => openImageModal(product.images, index)}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1 z-10 prev-${product._id} opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-white`}>
        <FiChevronLeft className="w-5 h-5" />
      </button>
      <button className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1 z-10 next-${product._id} opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-white`}>
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>

    {/* Product Details */}
    <div className="p-4">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">{product.title}</h3>
        {product.stock <= 10 && product.stock > 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
            Only {product.stock} left
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
      
      {/* Price Section */}
      <div className="mb-4">
        {product.discount > 0 ? (
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">
              RWF {(product.price * (1 - product.discount/100)).toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              RWF {product.price}
            </span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
              Save {product.discount}%
            </span>
          </div>
        ) : (
          <span className="text-xl font-bold text-blue-600">
            RWF {product.price}
          </span>
        )}
      </div>
      
      {/* Add to Cart Section */}
      {isInCart(product._id) ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button 
              onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) - 1)}
              disabled={getCartQuantity(product._id) <= 1}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-gray-800 font-medium">{getCartQuantity(product._id)}</span>
            <button 
              onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => handleRemoveFromCart(product._id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => handleAddToCart(product._id)}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
            product.stock === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FiShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      )}
    </div>
  </div>
))
}</div>
      </main>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setShowCart(false)}
          ></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className={`relative w-screen max-w-md transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                      <button 
                        onClick={() => setShowCart(false)}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in cart</p>
                  </div>

                  {cart.items.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {cart.items.map((item) => (
                        <div key={item.product} className="px-6 py-4">
                          <div className="flex">
                            <div 
                              className="flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => openImageModal(item.images, 0)}
                            >
                              <img
                                src={item.images?.[0].url}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                                <p className="mt-1 text-sm text-gray-500">RWF {item.price}</p>
                              </div>

                              <div className="flex-1 flex items-end justify-between">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                  >
                                    <FiMinus className="w-4 h-4" />
                                  </button>
                                  <span className="px-3 py-1 text-gray-800 font-medium">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                  >
                                    <FiPlus className="w-4 h-4" />
                                  </button>
                                </div>

                                <button 
                                  onClick={() => handleRemoveFromCart(item.product)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <FiX className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiShoppingCart className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                      <p className="text-gray-500 mb-4">Start shopping to add items to your cart</p>
                      <button
                        onClick={() => setShowCart(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </div>

                {cart.items.length > 0 && (
                  <div className="border-t border-gray-200 px-6 py-6">
                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                      <p>Subtotal</p>
                      <p>RWF {totalAmount}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <button
                      onClick={handleCreateOrder}
                      className="w-full bg-blue-600 border border-transparent rounded-lg py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <FiMapPin className="w-5 h-5" />
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Sidebar */}
      {showOrders && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setShowOrders(false)}
          ></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className={`relative w-screen max-w-md transform transition-transform duration-300 ${showOrders ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
                      <button 
                        onClick={() => setShowOrders(false)}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                  </div>

                  {orders.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <div key={order._id} className="px-6 py-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-base font-bold text-gray-900">
                                Order #{order._id.slice(-6).toUpperCase()}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>

                          <div className="mt-4 space-y-4">
                            {order.items.map((item, index) => (
                              <div key={`${item.product}-${index}`} className="flex">
                                <div 
                                  className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden cursor-pointer"
                                  onClick={() => openImageModal(item.images, 0)}
                                >
                                  <img
                                    src={`${item.images[0].url}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                  />
                                </div>

                                <div className="ml-4 flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                                  <p className="text-sm text-gray-500">
                                    RWF {item.purchasedPrice || item.price} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                              <p>Total</p>
                              <p className="text-blue-600">RWF {order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="mt-3 flex items-center text-sm text-gray-600">
                              <FiMapPin className="flex-shrink-0 mr-2 h-4 w-4 text-blue-500" />
                              <a 
                                href={order.deliveryLocation} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                              >
                                View delivery location
                              </a>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-600">
                              <FiPhone className="flex-shrink-0 mr-2 h-4 w-4 text-blue-500" />
                              <span>Contact: {order.phoneNumber}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiShoppingCart className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                      <p className="text-gray-500 mb-4">Your completed orders will appear here</p>
                      <button
                        onClick={() => setShowOrders(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setShowLocationModal(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <button 
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Information</h3>
            
            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Location Link
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  type="text"
                  id="location"
                  placeholder="Paste your Google Maps link here"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Accepted formats: google.com/maps, maps.google.com, maps.app.goo.gl, goo.gl/maps
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="Your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-bold text-blue-800 mb-2">How to get your Google Maps link:</h4>
              <ol className="text-sm text-blue-700 list-decimal list-inside space-y-2">
                <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Google Maps</a></li>
                <li>Search for your delivery location</li>
                <li>Click "Share" → "Copy link"</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrderWithLocation}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Image Modal */}
{showImageModal && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 transition-opacity duration-300"
    onClick={closeImageModal}
  >
    <div className="relative w-full max-w-6xl h-full max-h-[90vh]">
      {/* Close Button */}
      <button 
        onClick={closeImageModal}
        className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 transition-colors"
      >
        <FiX className="w-8 h-8" />
      </button>
      
      {/* Main Image Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Zoom]}
        navigation={{
          nextEl: '.image-modal-next',
          prevEl: '.image-modal-prev',
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} bg-white opacity-60 hover:opacity-100 transition-opacity"></span>`;
          }
        }}
        zoom={true}
        spaceBetween={20}
        slidesPerView={1}
        initialSlide={clickedImageIndex}
        className="w-full h-full rounded-lg overflow-hidden"
      >
        {currentProductImages.map((image, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <div className="swiper-zoom-container">
              <img
                src={image.url}
                alt={`Product image ${index + 1}`}
                className="max-w-full max-h-[80vh] object-contain cursor-zoom-in"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button className="image-modal-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 text-gray-800 rounded-full p-2 shadow-lg hover:bg-white transition-all">
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button className="image-modal-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 text-gray-800 rounded-full p-2 shadow-lg hover:bg-white transition-all">
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Thumbnail Navigation */}
      <div className="mt-4 mx-auto max-w-md">
        <Swiper
          slidesPerView={5}
          spaceBetween={10}
          centeredSlides={true}
          slideToClickedSlide={true}
          className="thumbnail-swiper"
        >
          {currentProductImages.map((image, index) => (
            <SwiperSlide 
              key={index} 
              className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              onClick={() => {
                document.querySelector('.image-modal-prev').click();
                document.querySelector('.image-modal-next').click();
              }}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-16 object-cover rounded border border-gray-200"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Download Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <a 
          href={currentProductImages[clickedImageIndex]?.url} 
          download
          className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-white transition-all flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download
        </a>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Shop;