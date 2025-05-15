
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus, Banknote, Lock, Mail, User, Coins, HandCoins } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Send registration request to backend
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");

      // For demo purposes, simulate successful registration when backend is not available
      if (!window.location.hostname.includes("localhost")) {
        toast.success("Demo registration successful! Please login.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bank-primary/10 via-blue-50 to-bank-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Decorative Panel */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-bank-primary to-bank-secondary w-2/5 p-10">
          <Coins className="h-16 w-16 text-white mb-4 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-white text-center mb-2">Join Us</h2>
          <p className="text-white/90 text-center text-base">
            Unlock exclusive rewards and start your financial journey today.
          </p>
          <div className="mt-6 text-white/80 text-sm text-center">
            Trusted by 50,000+ users
          </div>
          <div className="mt-8 w-full flex justify-center">
            <HandCoins className="h-20 w-20 text-white animate-none" />
          </div>
        </div>


        {/* Right Form Panel */}
        <div className="w-full md:w-3/5 p-10 lg:p-12">
          <div className="text-center">
            <div className="md:hidden flex justify-center mb-6">
              <Banknote className="h-12 w-12 text-bank-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-bank-primary to-bank-secondary inline-block">
              Create Your Account
            </h2>
            <p className="mt-3 text-sm text-gray-600 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-bank-primary hover:text-bank-secondary transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-11 focus:ring-2 focus:ring-bank-primary focus:border-bank-primary"
                    placeholder="John Doe"
                  />
                  <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

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
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-11 pr-11 focus:ring-2 focus:ring-bank-primary focus:border-bank-primary"
                    placeholder="••••••••"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-bank-primary focus:ring-bank-primary border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="font-medium text-bank-primary hover:text-bank-secondary transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-bank-primary hover:text-bank-secondary transition-colors">
                  Privacy Policy
                </a>
              </label>
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
                  Creating Account...
                </span>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
