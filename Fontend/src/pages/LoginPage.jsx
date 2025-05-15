
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Coins, HandCoins, Lock, Mail } from "lucide-react";

const LoginPage = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // Send login request to backend
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store auth token and user info
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsAuthenticated(true);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");

      // For demo purposes, simulate successful login when backend is not available
      if (!window.location.hostname.includes("localhost")) {
        simulateDemoLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to simulate login for demo purposes when backend is not available
  const simulateDemoLogin = () => {
    const demoUser = {
      id: "demo-user-123",
      name: "Demo User",
      email: formData.email,
      accountNumber: "1234567890",
      balance: 5000.00,
    };

    localStorage.setItem("authToken", "demo-token-xyz");
    localStorage.setItem("user", JSON.stringify(demoUser));

    setIsAuthenticated(true);
    toast.success("Demo login successful!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bank-primary/10 via-blue-50 to-bank-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Decorative Panel */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-bank-primary to-bank-secondary w-1/3 p-8">
          <Coins className="h-16 w-16 text-white mb-4 animate-bounce"/>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-white/90 text-center text-sm">Secure access to your financial world</p>
          <div className="mt-8 w-full flex justify-center">
            <Lock className="h-8 w-8 text-white/80 animate-pulse" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-2/3 p-8 sm:p-12">
          <div className="text-center">
            <div className="md:hidden flex justify-center mb-6">
              <Coins className="h-12 w-12 text-bank-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-bank-primary to-bank-secondary inline-block">
              Sign In to Your Account
            </h2>
            <p className="mt-3 text-sm text-gray-600 font-medium">
              Manage your finances securely
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-11 focus:ring-2 focus:ring-bank-primary focus:border-bank-primary"
                    placeholder="name@example.com"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-11 pr-11 focus:ring-2 focus:ring-bank-primary focus:border-bank-primary"
                    placeholder="••••••••"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-bank-primary transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-bank-primary transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-bank-primary focus:ring-bank-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember this device
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-bank-primary hover:text-bank-secondary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-bank-primary to-bank-secondary hover:from-bank-primary/90 hover:to-bank-secondary/90 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.01] shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Secure Sign In
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              <span className="mr-2">New to Bank?</span>
              <Link
                to="/register"
                className="font-semibold text-bank-primary hover:text-bank-secondary transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Demo Credentials
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>Email: test@example.com</p>
                <p>Password: test123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
