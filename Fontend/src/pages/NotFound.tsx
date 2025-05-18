import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-pink-50 text-gray-900 relative overflow-hidden font-sans px-4">
      {/* Floating Orbs */}
      <div className="absolute w-80 h-80 bg-pink-200 opacity-30 blur-3xl rounded-full top-[-10%] left-[-10%] animate-pulse" />
      <div className="absolute w-72 h-72 bg-indigo-200 opacity-20 blur-3xl rounded-full bottom-[-20%] right-[-5%] animate-pulse" />

      {/* Glitch 404 */}
      <div
        className="text-[7rem] sm:text-[9rem] font-extrabold relative mb-4 tracking-widest glitch"
        data-text="404"
        aria-label="404"
      >
        404
        <span className="glitch-overlay" aria-hidden="true">404</span>
      </div>

      {/* Message */}
      <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">
        Oops! You seem a bit lost in space <span aria-hidden>🌌</span>
      </h1>
      <p className="text-md sm:text-lg text-gray-600 mb-6 text-center">
        The page <code className="text-pink-500 font-mono">{location.pathname}</code> doesn’t exist.<br />
        But don’t worry-we’ll guide you home.
      </p>

      {/* Home Button */}
      <a
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-pink-400 via-indigo-400 to-blue-400 rounded-full text-white font-bold shadow-lg hover:shadow-indigo-300/50 hover:scale-105 transform transition duration-300"
      >
        🚀 Take Me Home
      </a>

      {/* Glitch Animation */}
      <style>{`
        .glitch {
          color: #6366f1;
          position: relative;
          letter-spacing: 0.1em;
          filter: drop-shadow(0 2px 8pxrgb(0, 0, 0));
        }
        .glitch-overlay {
          position: absolute;
          top: 10;
          left: 0;
          color:rgb(121, 77, 235);
          opacity: 1;
          animation: glitch 1.2s infinite;
          pointer-events: none;
        }
        @keyframes glitch {
          0% { transform: translate(0, 0); opacity: 0.5;}
          15% { transform: translate(-2px, 2px);}
          30% { transform: translate(2px, -1px); opacity: 0.6;}
          45% { transform: translate(-1px, 1px);}
          60% { transform: translate(1px, -2px); opacity: 0.7;}
          75% { transform: translate(0.5px, 1.5px);}
          100% { transform: translate(0, 0); opacity: 0.5;}
        }
      `}</style>
    </div>
  );
};

export default NotFound;
