"use client";

import { useEffect, useState } from "react";

export default function ThreeDBackground() {
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 3 : 6;

    const newCircles = [...Array(count)].map((_, i) => ({
      id: i,
      width: `${Math.random() * (isMobile ? 100 : 200) + 100}px`,
      height: `${Math.random() * (isMobile ? 100 : 200) + 100}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 10 + 15}s`,
    }));
    setCircles(newCircles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Very light blue gradient base - for a clean, premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-white" />

      {/* Large gradient blobs like hero section */}
      <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-[100px] animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[80px] animate-blob animation-delay-2000" />

      {/* Animated floating circles */}
      <div className="absolute inset-0">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className="absolute rounded-full bg-blue-400/30 blur-xl animate-float"
            style={{
              width: circle.width,
              height: circle.height,
              left: circle.left,
              top: circle.top,
              animationDelay: circle.animationDelay,
              animationDuration: circle.animationDuration,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -50px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-20px, -100px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translate(40px, -70px) scale(1.05);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 20s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}