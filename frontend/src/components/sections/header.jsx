"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Baby, ChefHat, Home, HeartPulse, Clock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [equalizerBars, setEqualizerBars] = useState([]);

  useEffect(() => {
    setEqualizerBars(
      Array.from({ length: 40 }).map(() => ({
        animationDuration: Math.random() * 2 + 2.5, // Much slower: 2.5s to 4.5s
        animationDelay: Math.random() * 1,
        height: Math.random() * 40 + 20
      }))
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
        ? "bg-blue-200/90 backdrop-blur-xl py-3 shadow-lg shadow-blue-200/50 border-b border-blue-300"
        : "bg-gradient-to-b from-blue-300/80 to-transparent py-5 backdrop-blur-[2px]"
        }`}
    >
      {/* Dynamic Equalizer Bars (Inverted Bass) - Only Visible When Unscrolled */}
      {!isScrolled && equalizerBars.length > 0 && (
        <div className="absolute top-0 left-0 w-full h-32 -z-10 flex items-start justify-between px-2 overflow-hidden pointer-events-none opacity-60">
          {equalizerBars.map((bar, i) => (
            <div
              key={i}
              className="w-1 md:w-2 bg-blue-500 rounded-b-full mx-[2px] animate-equalizer shadow-[0_0_8px_rgba(59,130,246,0.6)]"
              style={{
                animationDuration: `${bar.animationDuration}s`,
                animationDelay: `${bar.animationDelay}s`,
                height: `${bar.height}px`
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className={`text-xl font-bold font-display tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
            Safely Hands
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <div className="relative group">
            <Link href="/services" className="flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
              Services <ChevronDown size={14} />
            </Link>
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link href="/services/babysitter" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Baby size={16} className="text-blue-500" />
                Babysitters
              </Link>
              <Link href="/services/cooks" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <ChefHat size={16} className="text-blue-500" />
                Cooks & Chefs
              </Link>
              <Link href="/services/domestic-help" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Home size={16} className="text-blue-500" />
                Domestic Help
              </Link>
              <Link href="/services/elderly-care" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <HeartPulse size={16} className="text-blue-500" />
                Elderly Care
              </Link>
              <Link href="/services/24-hour-live-in" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Clock size={16} className="text-blue-500" />
                24 Hour Live-in
              </Link>
              <div className="border-t border-slate-100 mt-2 pt-2">
                <Link href="/services" className="block px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  View All Services →
                </Link>
              </div>
            </div>
          </div>
          <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <LayoutDashboard size={18} />
                  Admin Panel
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
                >
                  <User size={18} className="text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                  <ChevronDown size={14} className="text-slate-600" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/quick-book"
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300"
              >
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-slate-800 hover:bg-blue-50 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 w-[280px] h-full bg-white shadow-2xl z-50 transition-transform duration-300 transform lg:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div className="font-bold text-lg text-slate-900">Menu</div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {['Home', 'Services', 'About Us', 'Contact', 'Blog'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="mt-8 px-4">
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="font-bold text-blue-900 mb-1">New here?</div>
              <p className="text-xs text-blue-700 mb-3">Create an account to manage your bookings easily.</p>
              <Link
                href="/signup"
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          {user ? (
            <>
              <div className="mb-3 px-3 py-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Logged in as</p>
                <p className="font-semibold text-slate-900">{user.name}</p>
              </div>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold mb-2 hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl font-semibold mb-2 hover:shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Admin Panel
                </Link>
              )}
              <Link
                href="/dashboard/profile"
                className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold mb-2 hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={18} />
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center justify-center w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold mb-3 hover:bg-slate-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/broomit"
                className="flex items-center justify-center w-full bg-slate-900 text-white py-3 rounded-xl font-semibold shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a Service
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
