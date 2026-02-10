"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const variants = {
    top: {
        y: -220,
        z: -350,
        rotateX: 55,
        opacity: 0.3,
        scale: 0.85,
        zIndex: 10
    },
    center: {
        y: 0,
        z: 100,
        rotateX: 0,
        opacity: 1,
        scale: 1,
        zIndex: 50
    },
    bottom: {
        y: 220,
        z: -350,
        rotateX: -55,
        opacity: 0.3,
        scale: 0.85,
        zIndex: 10
    }
};

const gradientMap = [
    { from: "from-blue-100/80", to: "to-blue-200/80" },
    { from: "from-sky-100/80", to: "to-sky-200/80" },
    { from: "from-cyan-100/80", to: "to-cyan-200/80" },
    { from: "from-indigo-100/80", to: "to-indigo-200/80" }
];

export default function RevolverCard({ service, slot, index }) {
    if (!service) return null;

    const gradient = gradientMap[index % gradientMap.length];

    return (
        <Link href={`/services/${service.slug || service._id}`} className="absolute z-[inherit] transform-gpu">
            <motion.div
                variants={variants}
                initial={false}
                animate={slot}
                whileHover={slot === 'center' ? {
                    scale: 1.02,
                    z: 150,
                    boxShadow: "0 40px 70px -15px rgba(14, 165, 233, 0.4)",
                    transition: { duration: 0.3 }
                } : {}}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 22,
                    mass: 1
                }}
                style={{ transformStyle: "preserve-3d" }}
                className={`
          relative w-[340px] md:w-[450px] h-[220px]
          rounded-[2.5rem] shadow-2xl border border-white/40
          bg-gradient-to-br ${gradient.from} ${gradient.to}
          backdrop-blur-xl
          flex items-center p-6 gap-6
          cursor-pointer overflow-hidden
        `}
            >
                {/* Service Image - The "Magazine" Visual */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-[2rem] overflow-hidden shadow-inner bg-white/50 border border-white/20">
                    <Image
                        src={service.imageUrl || "https://placehold.co/400x400/e0f2fe/0ea5e9?text=Service"}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1 opacity-70">
                            Premium Service
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                            {service.title}
                        </h3>
                    </div>

                    <p className="text-slate-600 font-medium text-sm md:text-base leading-snug line-clamp-3">
                        {service.subtitle || service.description || "Bharat ke bharosemand care and staffing services."}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-12 bg-blue-500 rounded-full"></div>
                        <div className="h-1.5 w-4 bg-blue-300 rounded-full"></div>
                    </div>
                </div>

                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            </motion.div>
        </Link>
    );
}
