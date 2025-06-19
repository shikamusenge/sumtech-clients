import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Events from "./pages/Events";
import Careers from "./pages/Careers";
import Portfolio from "./pages/Portfolio";
import Shop from "./pages/Shop";
import Blogs from "./pages/Blogs";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingContactButton from "./components/FloatingContactButton.jsx";
import SEO from "./components/SEO.jsx";


function App() {
  return (
    <AuthProvider>
      <Router>
        <SEO/>
        <Navbar />
        <div style={{minHeight:"100vh"}} className="mt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/events" element={<Events />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
           } />
           <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
        <Footer />
        <FloatingContactButton/>
      </Router>
    </AuthProvider>
  );
}

export default App;