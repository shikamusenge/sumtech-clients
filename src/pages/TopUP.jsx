import React, { useState } from 'react';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiZap, FiClock, FiShield, FiGift } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TopUpProducts = () => {
  const [activeCategory, setActiveCategory] = useState('Mobile');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sample data
  const categories = [
    { id: 'Mobile', name: 'Mobile Credit', icon: <FiZap className="mr-2" /> },
    { id: 'Internet', name: 'Internet Bundles', icon: <FiClock className="mr-2" /> },
    { id: 'Gaming', name: 'Gaming Credits', icon: <FiShield className="mr-2" /> },
    { id: 'Gift', name: 'Gift Cards', icon: <FiGift className="mr-2" /> },
  ];

  const products = {
    Mobile: [
      { id: 1, name: '1000 RWF Credit', price: 1000, bonus: '+50 RWF bonus', popular: true },
      { id: 2, name: '2500 RWF Credit', price: 2500, bonus: '+150 RWF bonus', bestValue: true },
      { id: 3, name: '5000 RWF Credit', price: 5000, bonus: '+350 RWF bonus' },
      { id: 4, name: '10000 RWF Credit', price: 10000, bonus: '+800 RWF bonus' },
    ],
    Internet: [
      { id: 5, name: '1GB Daily', price: 1000, validity: '24 hours' },
      { id: 6, name: '3GB Weekly', price: 2500, validity: '7 days', bestValue: true },
      { id: 7, name: '10GB Monthly', price: 5000, validity: '30 days', popular: true },
      { id: 8, name: 'Unlimited Monthly', price: 15000, validity: '30 days' },
    ],
    Gaming: [
      { id: 9, name: '500 Gaming Points', price: 1000 },
      { id: 10, name: '1200 Gaming Points', price: 2000, bestValue: true },
      { id: 11, name: '3000 Gaming Points', price: 5000, popular: true },
    ],
    Gift: [
      { id: 12, name: 'Netflix 1 Month', price: 6000 },
      { id: 13, name: 'Spotify Premium', price: 5000, popular: true },
      { id: 14, name: 'Amazon Gift Card', price: 10000, bestValue: true },
    ]
  };

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            Instant Digital Top-Ups
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recharge mobile credit, buy internet bundles, gaming credits and gift cards in seconds
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <div className="flex space-x-2 mx-auto">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-5 py-3 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative">
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl ml-2">
            <FiChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
            {products[activeCategory].map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedProduct(product)}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Product Badges */}
                <div className="absolute top-3 right-3 space-y-1">
                  {product.popular && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full block">
                      Popular
                    </span>
                  )}
                  {product.bestValue && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full block">
                      Best Value
                    </span>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  
                  {product.bonus && (
                    <p className="text-blue-600 font-medium mb-3 flex items-center">
                      <FiGift className="mr-1" /> {product.bonus}
                    </p>
                  )}
                  
                  {product.validity && (
                    <p className="text-gray-500 mb-3 flex items-center">
                      <FiClock className="mr-1" /> Valid for {product.validity}
                    </p>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">RWF {product.price}</span>
                    <button className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center hover:bg-blue-700 transition-colors">
                      Buy Now <FiArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl mr-2">
            <FiChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md flex items-center"
          >
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiZap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Auto Top-Up</h3>
              <p className="text-gray-600">Set up automatic recharge when balance is low</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md flex items-center"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiGift className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Send as Gift</h3>
              <p className="text-gray-600">Share top-ups with friends and family</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md flex items-center"
          >
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FiShield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Bulk Purchase</h3>
              <p className="text-gray-600">Special discounts for large quantities</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-bold text-gray-900">RWF {selectedProduct.price}</span>
              </div>

              {selectedProduct.bonus && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus:</span>
                  <span className="font-bold text-blue-600">{selectedProduct.bonus}</span>
                </div>
              )}

              {selectedProduct.validity && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Validity:</span>
                  <span className="font-bold text-gray-900">{selectedProduct.validity}</span>
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter recipient number" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                Save for Later
              </button>
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                Confirm Purchase <FiArrowRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default TopUpProducts;