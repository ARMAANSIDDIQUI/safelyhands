"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { saveSession, getUser, getToken, clearSession, isAuthenticated } from "@/lib/auth";

const AuthContext = createContext({
    user: null,
    setUser: () => { },
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Restore session from localStorage on mount
        const currentUser = getUser();
        const token = getToken();
        if (currentUser && token) {
            setUser({ ...currentUser, token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Login failed");

            // Save session using centralized utility
            saveSession(data, data.token);
            setUser(data);

            // Redirect based on role
            if (data.role === 'worker') {
                router.push('/worker/dashboard');
            } else if (data.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, phone, password) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Signup failed");

            // Save session using centralized utility
            saveSession(data, data.token);
            setUser(data);

            router.push("/");
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        clearSession();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
