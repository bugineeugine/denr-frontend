"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const NotFoundPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; delay: number }>>(
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
      const elements = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setFloatingElements(elements);
    }, 0);
  }, []);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
          {/* Floating background elements */}
          {floatingElements.map((element) => (
            <div
              key={element.id}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                animationDelay: `${element.delay}s`,
                animation: `pulse 2s infinite ${element.delay}s, float 6s ease-in-out infinite ${element.delay}s`,
              }}
            />
          ))}

          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

          {/* Main content */}
          <div
            className={`text-center px-6 z-10 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            {/* 404 Number with glitch effect */}
            <div className="relative mb-8">
              <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 animate-pulse select-none">
                404
              </h1>
              <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-blue-500 opacity-50 transform translate-x-1 translate-y-1 -z-10 animate-pulse">
                404
              </div>
            </div>

            {/* Error message */}
            <div
              className={`mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Oops! Page Not Found</h2>
              <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                The page you&apos;re looking for seems to have vanished into the digital void. Don&apos;t worry, even
                the best explorers sometimes take a wrong turn.
              </p>
            </div>

            {/* Action buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-500 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <button
                onClick={handleGoHome}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <div className="flex items-center space-x-2">
                  <HomeOutlinedIcon className="w-5 h-5 transform transition-transform group-hover:scale-110" />
                  <span>Back to Home</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes blob {
              0% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
              100% {
                transform: translate(0px, 0px) scale(1);
              }
            }
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-20px);
              }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </div>
      </body>
    </html>
  );
};

export default NotFoundPage;
