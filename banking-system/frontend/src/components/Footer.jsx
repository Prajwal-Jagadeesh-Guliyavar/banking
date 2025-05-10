import {Link} from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-bank-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div>
            <h3 className="text-xl font-semibold mb-4">Bankit</h3>
            <p className="mb-4 text-gray-300">Providing secure and innovative banking solutions since 2023. Your trusted partner for all financial needs.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quickies</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Banking Services</h3>
            <ul className="space-y-2">
              <li><Link to="/personal-banking" className="text-gray-300 hover:text-white transition-colors">Personal Banking</Link></li>
              <li><Link to="/business-banking" className="text-gray-300 hover:text-white transition-colors">Business Banking</Link></li>
              <li><Link to="/loan" className="text-gray-300 hover:text-white transition-colors">Loans & Mortgages</Link></li>
              <li><Link to="/investments" className="text-gray-300 hover:text-white transition-colors">Investments</Link></li>
              <li><Link to="/insurance" className="text-gray-300 hover:text-white transition-colors">Insurance</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={18} />
                <span className="text-gray-300">123 Banking Street, Finance City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} />
                <span className="text-gray-300">(123) 456-7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} />
                <span className="text-gray-300">contact@bankhive.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-gray-400">© {new Date().getFullYear()} BankHive. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;