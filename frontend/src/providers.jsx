"use client";

import { AuthProvider } from "@/context/AuthContext";
import { TutorialProvider } from "@/context/TutorialContext";
import TutorialOverlay from "@/components/ui/tutorial-overlay";

export function Providers({ children }) {
    return (
        <TutorialProvider>
            <AuthProvider>
                <TutorialOverlay />
                {children}
            </AuthProvider>
        </TutorialProvider>
    );
}
