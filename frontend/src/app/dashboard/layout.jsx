"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    CalendarDays,
    Settings,
    LogOut,
    User,
    Home
} from "lucide-react";

export default function DashboardLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (!user) return null;

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
        { name: "Profile", href: "/dashboard/profile", icon: User },
        // { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-50/50">
            {/* Sidebar */}
            <aside className="hidden w-64 border-r bg-white md:block">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/dashboard" className="text-2xl font-bold font-display text-slate-900">
                        <span className="text-primary-600">Safely Hands</span>
                    </Link>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary-50 text-primary-600"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
                <div className="mt-auto p-4 border-t space-y-2">
                    <Link
                        href="/"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <Home className="h-4 w-4" />
                        Back to Site
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
