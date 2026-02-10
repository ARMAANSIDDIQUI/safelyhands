"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RevolverCard from "./revolver-card";

export default function HeroRevolver() {
    const [services, setServices] = useState([]);
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter active services
                    const activeServices = Array.isArray(data) ? data.filter(s => s.isActive !== false) : [];
                    setServices(activeServices);
                }
            } catch (err) {
                console.error("Failed to fetch services for hero revolver", err);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        if (services.length < 2 || isPaused) return;

        const interval = setInterval(() => {
            setActive(i => (i + 1) % services.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [services, isPaused]);

    if (services.length === 0) return (
        <div className="h-[520px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    const total = services.length;

    // Logic to handle small service sets for infinite effect
    const getPrev = () => (active - 1 + total) % total;
    const getNext = () => (active + 1) % total;

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative h-[650px] w-full flex items-center justify-center overflow-visible perspective-[2000px]"
        >

            {/* Intense Dynamic Glow */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-blue-500/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>

            {/* TOP CARD */}
            <RevolverCard
                key={`top-${services[getPrev()]._id}`}
                service={services[getPrev()]}
                slot="top"
                index={getPrev()}
            />

            {/* TAGLINE - Floating in front of the cylinder */}
            <motion.div
                initial={{ opacity: 0, z: 200 }}
                animate={{ opacity: 1, z: 400 }}
                className="absolute top-[40%] md:top-[38%] z-[100] pointer-events-none"
            >
                <div className="bg-white/60 backdrop-blur-2xl px-10 py-3 rounded-full border border-blue-200/50 shadow-2xl shadow-blue-500/10 transform-gpu">
                    <span className="text-blue-700 font-extrabold text-sm md:text-xl tracking-[0.2em] uppercase block text-center drop-shadow-sm">
                        Har zaroorat ke liye ek bharosemand haath
                    </span>
                </div>
            </motion.div>

            {/* CENTER CARD */}
            <RevolverCard
                key={`center-${services[active]._id}`}
                service={services[active]}
                slot="center"
                index={active}
            />

            {/* BOTTOM CARD */}
            <RevolverCard
                key={`bottom-${services[getNext()]._id}`}
                service={services[getNext()]}
                slot="bottom"
                index={getNext()}
            />

        </div>
    );
}
