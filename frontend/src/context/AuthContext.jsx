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
    verifyEmail: async () => { },
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
            console.log("AuthContext: Restoring session. Token present:", !!token);
            setUser({ ...currentUser, token });
        } else {
            console.log("AuthContext: No session found in localStorage");
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
            console.log("AuthContext: Login successful. Token:", data.token ? "Yes" : "No");
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

            // Don't log in yet - wait for OTP verification
            return { success: true, message: data.message, email: data.email };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const verifyEmail = async (email, otp) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Verification failed");

            // Save session using centralized utility
            saveSession(data, data.token);
            console.log("AuthContext: Email verified. Token:", data.token ? "Yes" : "No");
            setUser(data);

            router.push("/dashboard");
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

    const updateUserProfile = async (updatedFields) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Not logged in");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedFields),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update profile");

            const newUserData = { ...user, ...data, token: token || data.token };
            saveSession(newUserData, newUserData.token);
            setUser(newUserData);

            return { success: true, user: newUserData };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const addAddress = async (addressData) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Not logged in");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(addressData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add address");

            const newUserData = { ...user, addresses: data.addresses, address: data.address };
            saveSession(newUserData, newUserData.token);
            setUser(newUserData);

            return { success: true, addresses: data.addresses, address: data.address };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Not logged in");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/addresses/${addressId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete address");

            const newUserData = { ...user, addresses: data.addresses, address: data.address };
            saveSession(newUserData, newUserData.token);
            setUser(newUserData);

            return { success: true, addresses: data.addresses, address: data.address };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Not logged in");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/addresses/${addressId}/default`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to set default address");

            const newUserData = { ...user, addresses: data.addresses, address: data.address };
            saveSession(newUserData, newUserData.token);
            setUser(newUserData);

            return { success: true, addresses: data.addresses, address: data.address };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, verifyEmail, logout, updateUserProfile, addAddress, deleteAddress, setDefaultAddress }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
