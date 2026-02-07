"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, CalendarCheck, Briefcase, Settings, LogOut, MessageSquareQuote, Home, ShieldCheck, Wrench } from "lucide-react";

export default function AdminLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== 'admin') {
                router.push("/dashboard");
            }
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:block shrink-0 h-screen sticky top-0 overflow-y-auto">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/admin" className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                        Safely Hands <span className="text-blue-500">Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <SidebarItem href="/admin/bookings" icon={<CalendarCheck size={20} />} label="Bookings & Payments" />
                    <SidebarItem href="/admin/services" icon={<Briefcase size={20} />} label="Services" />
                    <SidebarItem href="/admin/workers" icon={<Users size={20} />} label="Workers" />
                    <SidebarItem href="/admin/users" icon={<Users size={20} />} label="Users" />
                    <SidebarItem href="/admin/team" icon={<ShieldCheck size={20} />} label="Team Management" />
                    <SidebarItem href="/admin/testimonials" icon={<MessageSquareQuote size={20} />} label="Testimonials" />
                    <SidebarItem href="/admin/maintenance" icon={<Wrench size={20} />} label="Maintenance" />
                    <SidebarItem href="/admin/carousel" icon={<LayoutDashboard size={20} />} label="Carousel" />
                    <SidebarItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <Link
                        href="/"
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors mb-2"
                    >
                        <Home size={20} />
                        <span className="font-medium">Back to Site</span>
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            router.push('/');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
                    <h2 className="text-lg font-semibold text-slate-800">Admin Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-600">{user?.name}</span>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ href, icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    );
}
