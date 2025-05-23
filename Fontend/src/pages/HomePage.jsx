
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield, Users, TrendingUp, CreditCard,
  Smartphone, Globe, CheckCircle2, Award
} from "lucide-react";
import React from 'react';
import GoldPriceChart from '../components/GoldPriceChart';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-bank-primary to-bank-secondary py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Banking Solutions for a <span className="text-yellow-300">Brighter</span> Future
              </h1>
              <p className="text-white/90 text-lg mb-8 max-w-lg">
                Experience secure, innovative, and personalized banking services designed to help you achieve your financial goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register">
                  <Button size="lg" variant="outline" className="bg-white border-white text-bank-primary hover:bg-white/10 hover:text-white">
                    OPEN AN ACCOUNT
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-bank-primary hover:bg-white/10 hover:text-white">
                    LOGIN
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative">
                {/* Gold Price Card */}
                <div className="w-full h-auto bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                  <div className="p-6 relative">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center justify-center h-full">
                        <h2 className="text-xl md:text-2xl font-semibold text-white text-center">
                           10g of 24k <span className="text-yellow-300 font-bold">GOLD</span> in Bengaluru is
                        </h2>
                      </div>
                      <div className="flex items-center justify-center h-full">
                        <p className="text-2xl md:text-4xl font-bold text-green-400 mt-3">
                          ₹95,520.00 <span className="text-sm text-gray-300 mt-0">Indian Rupee</span>
                        </p>
                        <p className="text-sm text-white">
                          Friday, May 16, 2025, 12:12 AM IST
                        </p>
                      </div>
                      {/* Optional: Dropdown */}
                      {/* <select className="bg-gray-700 text-white p-2 rounded">
                        <option>Bengaluru</option>
                      </select> */}
                    </div>
                    {/* Timeframe Buttons */}
                    <div className="flex space-x-2 mb-4">
                      {['5D', '1M', '1Y', 'Max'].map((period) => (
                        <button
                          key={period}
                          className={`px-3 py-1 rounded text-sm transition ${
                            period === '1M'
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-450 text-white hover:bg-gray-600'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                    <GoldPriceChart />
                  </div>
                </div>
                {/* Decorative Blurs */}
                <div className="absolute -bottom-6 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
                <div className="absolute top-10 -left-6 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose BankHive?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience banking designed to meet your needs with advanced security, personalized service, and innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Secure Banking",
                description: "Advanced security protocols to protect your financial data and transactions",
                icon: <Shield className="text-bank-primary" size={32} />
              },
              {
                title: "Personal Service",
                description: "Dedicated support team to assist with all your banking needs",
                icon: <Users className="text-bank-primary" size={32} />
              },
              {
                title: "Growth Opportunities",
                description: "Investment options designed to help your money grow",
                icon: <TrendingUp className="text-bank-primary" size={32} />
              },
              {
                title: "Global Access",
                description: "Access your accounts from anywhere in the world",
                icon: <Globe className="text-bank-primary" size={32} />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-bank-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Banking Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial solutions to support every stage of your life journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personal Banking",
                description: "Manage your day-to-day finances with our flexible checking and savings accounts",
                icon: <CreditCard className="text-bank-primary" size={32} />,
                button: "Learn More"
              },
              {
                title: "Loan Solutions",
                description: "Find the perfect financing option with competitive rates for all your needs",
                icon: <TrendingUp className="text-bank-primary" size={32} />,
                button: "Apply Now",
                link: "/loan"
              },
              {
                title: "Mobile Banking",
                description: "Bank on the go with our secure and user-friendly mobile application",
                icon: <Smartphone className="text-bank-primary" size={32} />,
                button: "Download App"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Link to={service.link || "#"}>
                  <Button variant="outline" className="border-bank-primary text-bank-primary hover:bg-bank-primary hover:text-white">
                    {service.button}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "BankHive has revolutionized how I manage my finances. Their mobile app is intuitive and their customer service is exceptional.",
                name: "Sarah Johnson",
                title: "Small Business Owner"
              },
              {
                quote: "The loan process was surprisingly easy and transparent. I got approved quickly and the rates were better than competitors.",
                name: "Michael Chen",
                title: "Homeowner"
              },
              {
                quote: "I've been with many banks over the years, but none have provided the personalized service that BankHive offers.",
                name: "Emma Rodriguez",
                title: "Freelance Designer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 relative">
                <div className="text-bank-primary mb-4">
                  <svg className="w-10 h-10 opacity-20" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-2.209 0-4 1.791-4 4v12h12v-16h-8zM26 8h-8v16h12v-12c0-2.209-1.791-4-4-4z"></path>
                  </svg>
                </div>
                <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="bg-gray-300 rounded-full w-10 h-10 mr-3 overflow-hidden flex items-center justify-center">
                    <img
                      src="/default.jpg"
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-bank-primary to-bank-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their banking experience with BankHive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="outline" className="bg-white border-white text-bank-primary hover:bg-white/10 hover:text-white">
                OPEN AN ACCOUNT TODAY
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-bank-primary hover:bg-white/10 hover:text-white">
                CONTACT US
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Award className="text-bank-primary mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">Award-Winning Banking</h3>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="text-gray-400">TRUSTED PARTNER</div>
              <div className="text-gray-400">BEST DIGITAL BANK 2023</div>
              <div className="text-gray-400">TOP CUSTOMER SATISFACTION</div>
              <div className="text-gray-400">SECURITY EXCELLENCE</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
