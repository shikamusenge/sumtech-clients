import React from "react";
import { ArrowRight, ChevronRight, Mail, Phone, BarChart3, Shield, Clock, Star, ChevronDown, ArrowUpRight, Cpu, Globe, Server, Code, Database, Smartphone, Link } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Contacts from "./Contact";
import Hero from "../components/Hero";
import TopUpProducts from "./TopUP";

const Home = () => {
  const services = [
    {
      id: 1,
      title: "IT Consulting",
      description: "Strategic technology advisory to optimize your business infrastructure and digital transformation",
      icon: <Cpu className="h-10 w-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 2,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies for optimal performance",
      icon: <Globe className="h-10 w-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 3,
      title: "Electronics Repair",
      description: "Professional repair services for all electronic devices with genuine replacement parts",
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1452&q=80",
    },
    {
      id: 4,
      title: "Cloud Solutions",
      description: "Secure and scalable cloud infrastructure tailored to your business requirements",
      icon: <Server className="h-10 w-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "James Kariuki",
      position: "CEO, Nairobi Tech Solutions",
      quote: "SamTech transformed our IT infrastructure with their consulting services. Their team is professional and knowledgeable.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Sarah Mwangi",
      position: "Marketing Director, Digital Africa",
      quote: "Our new website developed by SamTech has significantly increased our online conversions and customer engagement.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "David Omondi",
      position: "Operations Manager, ElectroFix",
      quote: "Reliable electronics repair services with quick turnaround times. Highly recommended for businesses.",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 4
    }
  ];

  const stats = [
    { value: "20+", label: "Satisfied Clients" },
    { value: "2+", label: "Years Experience" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
     

     <Hero/>
     <TopUpProducts/>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-blue-50 dark:bg-gray-800 rounded-xl">
                <p className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-yellow-400 mb-2">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900" id="products">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive IT solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img src={service.image} alt={service.title} className="object-cover w-full h-full" />
                </div>
                <div className="p-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear what our clients say about our services
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
              }}
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-blue-100 dark:border-gray-700 mb-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-lg italic mb-6">"{testimonial.quote}"</blockquote>
                      <div>
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-gray-600 dark:text-gray-400">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <Contacts/>
    </div>
  );
};

export default Home;