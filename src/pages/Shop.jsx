import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md bg-red-50 rounded-lg">
          <HiOutlineExclamationCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-red-600">Error Loading Products</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={fetchAllData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Our Products</h1>
            
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setShowOrders(!showOrders)}
              >
                <span>My Orders</span>
              </button>
              <button 
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setShowCart(!showCart)}
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
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
                          src={`${BASE_URL}${image}`}
                          alt={`${product.title} ${index + 1}`}
                          onClick={() => openImageModal(product.images, index)}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1 z-10 prev-${product._id}`}>
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1 z-10 next-${product._id}`}>
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold text-blue-600 mb-3">RWF {product.price}</p>
                  
                  {isInCart(product._id) ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) - 1)}
                          disabled={getCartQuantity(product._id) <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-gray-800">{getCartQuantity(product._id)}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(product._id, getCartQuantity(product._id) + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4 py-6 sm:px-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                      <button 
                        onClick={() => setShowCart(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {cart.items.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {cart.items.map((item) => (
                        <div key={item.product} className="px-4 py-4 sm:px-6">
                          <div className="flex">
                            <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                              <img
                                src={`${BASE_URL}${item.images[0]}`}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                                <p className="mt-1 text-sm text-gray-500">RWF {item.price}</p>
                              </div>

                              <div className="flex-1 flex items-end justify-between">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    <FiMinus className="w-4 h-4" />
                                  </button>
                                  <span className="px-2 py-1 text-gray-800">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    <FiPlus className="w-4 h-4" />
                                  </button>
                                </div>

                                <button 
                                  onClick={() => handleRemoveFromCart(item.product)}
                                  className="text-red-500 hover:text-red-700"
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
                    <div className="px-4 py-12 text-center">
                      <FiShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                      <p className="text-gray-500">Start shopping to add items to your cart</p>
                    </div>
                  )}
                </div>

                {cart.items.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                      <p>Subtotal</p>
                      <p>RWF {totalAmount}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 mb-6">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <button
                      onClick={handleCreateOrder}
                      className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Checkout
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowOrders(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4 py-6 sm:px-6 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">My Orders</h2>
                      <button 
                        onClick={() => setShowOrders(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {orders.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <div key={order._id} className="px-4 py-6 sm:px-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                Order #{order._id.slice(-6).toUpperCase()}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="mt-4 space-y-4">
                            {order.items.map((item, index) => (
                              <div key={`${item.product}-${index}`} className="flex">
                                <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                                  <img
                                    src={`${BASE_URL}${item.images[0]}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
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
                            <div className="flex justify-between text-sm text-gray-600">
                              <p>Total</p>
                              <p className="font-medium">RWF {order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-600">
                              <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                              <a 
                                href={order.deliveryLocation} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View delivery location
                              </a>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-600">
                              <FiPhone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                              <span>Contact: {order.phoneNumber}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiShoppingCart className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                      <p className="text-gray-500">Your completed orders will appear here</p>
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLocationModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <button 
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h3>
            
            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Location Link
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  placeholder="Paste your Google Maps link here"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Accepted formats: google.com/maps, maps.google.com, maps.app.goo.gl, goo.gl/maps
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="Your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h4 className="text-sm font-medium text-blue-800 mb-2">How to get your Google Maps link:</h4>
              <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Maps</a></li>
                <li>Search for your delivery location</li>
                <li>Click "Share" → "Copy link"</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrderWithLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={closeImageModal}>
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
            >
              <FiX className="w-8 h-8" />
            </button>
            
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              initialSlide={clickedImageIndex}
              className="w-full h-full"
            >
              {currentProductImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${BASE_URL}${image}`}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;