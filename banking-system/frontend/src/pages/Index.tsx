import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // authentication check
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <HomePage />;
};

export default Index;