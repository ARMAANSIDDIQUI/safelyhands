"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBroomITRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/safeit");
    }, [router]);

    return (
        <div className="p-12 text-center font-sans">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Redirecting to SafeIt Admin Queue...</p>
        </div>
    );
}
