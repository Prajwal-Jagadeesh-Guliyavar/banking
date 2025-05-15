import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-light pt-16 pb-8"> {/* Changed background and text color */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"> {/* Increased gap */}
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">BankIt</h3> {/* Brighter heading */}
            <p className="mb-4 text-brand-gray"> {/* Muted text */}
              Providing secure and innovative banking solutions. Your trusted partner for all financial needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Home</Link></li>
              <li><Link to="/about" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">About Us</Link></li>
              <li><Link to="/services" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Services</Link></li>
              <li><Link to="/faq" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">FAQ</Link></li>
              <li><Link to="/contact" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Banking Services</h3>
            <ul className="space-y-2">
              <li><Link to="/personal-banking" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Personal Banking</Link></li>
              <li><Link to="/business-banking" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Business Banking</Link></li>
              <li><Link to="/loan" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Loans & Mortgages</Link></li>
              <li><Link to="/investments" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Investments</Link></li>
              <li><Link to="/insurance" className="text-brand-gray hover:text-brand-orange transition-colors duration-150">Insurance</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3"> {/* Use items-start for better alignment if text wraps */}
                <MapPin size={18} className="text-brand-orange mt-1 flex-shrink-0" /> {/* Icon color and alignment */}
                <span className="text-brand-gray">St Lazaurus Larnaca, Cyprus 6010-6060</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-brand-orange flex-shrink-0" />
                <span className="text-brand-gray">7894561230</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-orange flex-shrink-0" />
                <span className="text-brand-gray">contact@bankit.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8"> {/* Adjusted border color and spacing */}
          <p className="text-center text-sm text-brand-gray">© {new Date().getFullYear()} BankHive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;