import { useState } from "react";
import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Home, User, CreditCard,
  PiggyBank, FileText, LogOut, LogIn
} from 'lucide-react';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    closeMobileMenu();
  };

  const navItems = [
    { name : 'Home', path : '/', icon : <Home size ={18} />},
    ...(isAuthenticated ? [
      { name: 'Dashboard', path: '/dashboard', icon: <CreditCard size={18} /> },
      { name: 'Transactions', path: '/transactions', icon: <FileText size={18} /> },
      { name: 'Apply for Loan', path: '/loan', icon: <PiggyBank size={18} /> },
      { name: 'Profile', path: '/profile', icon: <User size={18} /> },
    ] : [] ),
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'bg-bank-accent text-white' : 'text-gray-700 hover:bg-bank-light';
  };

  return(
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="h-8 w-8 bg-bank-primary rounded-md flex items-center justify-center">
                <PiggyBank size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-bank-primary">Bankit</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${isActive(item.path)}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-bank-primary hover:bg-bank-dark flex items-center space-x-1">
                  <LogIn size={18} />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-bank-primary hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.path)
                }`}
                onClick={closeMobileMenu}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/login" className="block" onClick={closeMobileMenu}>
                <Button variant="default" className="w-full bg-bank-primary hover:bg-bank-dark flex items-center justify-center space-x-2">
                  <LogIn size={18} />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}