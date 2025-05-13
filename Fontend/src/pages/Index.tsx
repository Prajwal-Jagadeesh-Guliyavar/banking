
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (token) {
      // Redirect to dashboard if already authenticated
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return <HomePage />;
};

export default Index;
