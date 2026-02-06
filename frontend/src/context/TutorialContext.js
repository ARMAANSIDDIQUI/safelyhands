"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const TutorialContext = createContext();

const STEPS = [
    {
        id: 'booking-step',
        targetId: 'booking-form',
        path: '/booking',
        title: 'Book a Service',
        content: 'Start by filling out this form to book your service clearly. Select the service type, date, and time.',
        position: 'left'
    },
    {
        id: 'dashboard-step',
        targetId: 'dashboard-stats',
        path: '/dashboard',
        title: 'Track Activities',
        content: 'Here you can see your active services and pending actions at a glance.',
        position: 'bottom'
    },
    {
        id: 'attendance-step',
        targetId: 'dashboard-bookings-link', // We need to add this ID to the link
        path: '/dashboard',
        title: 'Manage Attendance',
        content: 'Click here to view your bookings and mark daily attendance for your workers.',
        position: 'bottom'
    }
];

export function TutorialProvider({ children }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const router = useRouter();
    const pathname = usePathname();

    const startTutorial = () => {
        setIsActive(true);
        setCurrentStepIndex(0);
        // Navigate to first step if needed
        if (pathname !== STEPS[0].path) {
            router.push(STEPS[0].path);
        }
    };

    const endTutorial = () => {
        setIsActive(false);
        setCurrentStepIndex(0);
    };

    const nextStep = () => {
        if (currentStepIndex < STEPS.length - 1) {
            const nextIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextIndex);

            // Handle navigation
            if (STEPS[nextIndex].path !== pathname) {
                router.push(STEPS[nextIndex].path);
            }
        } else {
            endTutorial();
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            const prevIndex = currentStepIndex - 1;
            setCurrentStepIndex(prevIndex);

            // Handle navigation
            if (STEPS[prevIndex].path !== pathname) {
                router.push(STEPS[prevIndex].path);
            }
        }
    };

    // Auto-navigate to correct path if tutorial is active but user navigated away
    useEffect(() => {
        if (isActive) {
            const targetPath = STEPS[currentStepIndex].path;
            if (pathname !== targetPath) {
                router.push(targetPath);
            }
        }
    }, [isActive, currentStepIndex, pathname, router]);

    return (
        <TutorialContext.Provider value={{
            isActive,
            currentStep: STEPS[currentStepIndex],
            totalSteps: STEPS.length,
            stepIndex: currentStepIndex,
            startTutorial,
            endTutorial,
            nextStep,
            prevStep
        }}>
            {children}
        </TutorialContext.Provider>
    );
}

export const useTutorial = () => useContext(TutorialContext);
