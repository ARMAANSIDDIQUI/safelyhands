"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const gradientMap = [
    "from-blue-500/20",
    "from-sky-500/20",
    "from-cyan-500/20",
    "from-indigo-500/20"
];

export default function RevolverCard({ service, slot, index }) {
    if (!service) return null;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const variants = {
        enter: {
            x: isMobile ? 150 : 350,
            y: 0,
            z: -800,
            opacity: 0,
            scale: 0.4,
            rotateY: 0,
        },
        top: { // prev
            x: isMobile ? 120 : 300,
            y: isMobile ? -140 : -220,
            z: -200,
            rotateX: 0,
            rotateY: 0,
            opacity: 0.85,
            scale: isMobile ? 0.55 : 0.7,
            zIndex: 20
        },
        center: { // active
            x: isMobile ? -100 : -240,
            y: 0,
            z: 150,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            scale: isMobile ? 0.75 : 1,
            zIndex: 50
        },
        bottom: { // next
            x: isMobile ? 120 : 300,
            y: isMobile ? 140 : 220,
            z: -200,
            rotateX: 0,
            rotateY: 0,
            opacity: 0.85,
            scale: isMobile ? 0.55 : 0.7,
            zIndex: 20
        },
        exit: {
            x: isMobile ? 150 : 350,
            y: 0,
            z: -800,
            opacity: 0,
            scale: 0.4,
            rotateY: 0,
        }
    };

    const gradient = gradientMap[index % gradientMap.length];

    return (
        <Link href={`/services/${service.slug || service._id}`} className="absolute z-[inherit] transform-gpu">
            <motion.div
                variants={variants}
                initial="enter"
                animate={slot}
                exit="exit"
                whileHover={slot === 'center' ? {
                    scale: 1.05,
                    z: 200,
                    boxShadow: "0 0 80px 20px rgba(14, 165, 233, 0.3)",
                    transition: { duration: 0.3 }
                } : {}}
                transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 20,
                    mass: 1.2
                }}
                style={{ transformStyle: "preserve-3d" }}
                className={`
          relative w-[210px] h-[210px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px]
          rounded-full shadow-2xl border-4 border-white/40
          bg-gradient-to-br ${gradient} to-transparent
          backdrop-blur-2xl
          flex items-center justify-center
          cursor-pointer overflow-hidden
          group
    `}
            >
                {/* Service Image - Circular Magazine visual */}
                <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white/30">
                    <Image
                        src={service.imageUrl || "https://placehold.co/600x600/e0f2fe/0ea5e9?text=Service"}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Dark Gradient Overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>

                {/* Floating Content Overlay */}
                <div className="absolute bottom-10 left-0 right-0 px-6 text-center transform translate-z-10">
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-lg mb-1">
                        {service.title}
                    </h3>
                    <div className="h-1 w-12 bg-blue-400 mx-auto rounded-full shadow-lg"></div>
                </div>

                {/* Magazine Chamber Hole Effect */}
                <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none ring-1 ring-white/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_70%,rgba(0,0,0,0.1)_100%)] pointer-events-none"></div>
            </motion.div>
        </Link>
    );
}
