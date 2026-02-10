"use client";

import { motion } from "framer-motion";

const variants = {
    top: {
        y: -150,
        scale: 0.75,
        opacity: 0.55,
        rotateX: 35,
        zIndex: 10
    },
    center: {
        y: 0,
        scale: 1,
        opacity: 1,
        rotateX: 0,
        zIndex: 30
    },
    bottom: {
        y: 150,
        scale: 0.75,
        opacity: 0.55,
        rotateX: -35,
        zIndex: 10
    }
};

const gradientMap = [
    { from: "from-blue-100", to: "to-blue-200" },
    { from: "from-sky-100", to: "to-sky-200" },
    { from: "from-cyan-100", to: "to-cyan-200" },
    { from: "from-indigo-100", to: "to-indigo-200" }
];

const iconMap = {
    'babysitter': 'https://cdn-icons-png.flaticon.com/512/3069/3069156.png',
    'cooks': 'https://cdn-icons-png.flaticon.com/512/1830/1830839.png',
    'elderly-care': 'https://cdn-icons-png.flaticon.com/512/2967/2967332.png',
    'all-rounder': 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'
};

const defaultIcon = 'https://cdn-icons-png.flaticon.com/512/2910/2910795.png';

export default function RevolverCard({ service, slot, index }) {
    if (!service) return null;

    const gradient = gradientMap[index % gradientMap.length];
    const icon = service.icon || iconMap[service.slug] || defaultIcon;

    return (
        <motion.div
            variants={variants}
            initial={false}
            animate={slot}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 20
            }}
            className={`
        absolute w-[340px] md:w-[400px] h-[190px]
        rounded-3xl shadow-2xl border border-white/50
        bg-gradient-to-br ${gradient.from} ${gradient.to}
        backdrop-blur-sm
        flex flex-col justify-center p-8
        preserve-3d
      `}
        >
            <div className="flex items-center gap-5 mb-4">
                <div className="w-14 h-14 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                    <img src={icon} alt={service.title} className="w-10 h-10 object-contain" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
                        {service.title}
                    </h3>
                    <div className="w-12 h-1 bg-slate-800/20 rounded-full"></div>
                </div>
            </div>
            <p className="text-slate-700 font-medium leading-tight line-clamp-2">
                {service.subtitle || service.description || "Trusted professional services for your home."}
            </p>
        </motion.div>
    );
}
