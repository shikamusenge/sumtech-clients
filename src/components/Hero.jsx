import React from 'react'
import { ArrowRight,  Star,Link } from 'lucide-react';

const HeroSection = () => {
    return(<>
         {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
          alt="Technology background"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="container relative z-20 mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-4">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-2">
              Trusted Technology Partner
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Innovative <span className="text-yellow-400">IT Solutions</span> for Your Business
            </h1>
            <p className="text-xl text-blue-100 max-w-[600px]">
              SamTech provides cutting-edge technology services including IT consulting, web development, 
              and electronics repair to help your business thrive in the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium rounded-lg transition-all group">
                Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-900 transition-all">
              <Link/>
                    Our Services
              </button>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden">
                    <img src={`https://randomuser.me/api/portraits/${i%2===0?'women':'men'}/${i*10}.jpg`} alt="User" width={32} height={32} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-blue-100">
                  <strong>4.9/5</strong> from 150+ reviews
                </span>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-yellow-400/20 rounded-full filter blur-3xl"></div>
            <div className="relative z-10 bg-gradient-to-br from-blue-800 to-blue-900 p-1 rounded-2xl border border-blue-700">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Team working"
                className="rounded-xl w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
    )

}
export default HeroSection;