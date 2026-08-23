"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BroomITRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/safeit");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <div className="text-center p-8">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Redirecting to SafeIt (Instant Help in 15 Mins)...</p>
            </div>
        </div>
    );
}
