"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RevolverCard from "./revolver-card";

export default function HeroRevolver() {
    const [services, setServices] = useState([]);
    const [active, setActive] = useState(0);

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
        if (services.length < 2) return;

        const interval = setInterval(() => {
            setActive(i => (i + 1) % services.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [services]);

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
        <div className="relative h-[600px] w-full flex items-center justify-center overflow-visible perspective-[1200px]">

            {/* Dynamic Background Glow */}
            <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-blue-400/20 blur-[100px] rounded-full -z-10"></div>

            {/* TOP CARD */}
            <RevolverCard
                key={`top-${services[getPrev()]._id}`}
                service={services[getPrev()]}
                slot="top"
                index={getPrev()}
            />

            {/* TAGLINE - Fixed between TOP and CENTER */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-[40%] md:top-[38%] z-[40] pointer-events-none"
            >
                <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-blue-100 shadow-sm">
                    <span className="text-blue-600 font-bold text-sm md:text-base tracking-[0.1em] uppercase block text-center">
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
