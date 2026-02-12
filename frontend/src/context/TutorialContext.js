"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const TutorialContext = createContext();

const STEPS = [
    {
        id: 'welcome-step',
        targetId: 'hero-title',
        path: '/',
        title: 'Welcome to Safely Hands',
        content: 'Your trusted partner for home makers in Moradabad. Let us show you around!',
        position: 'bottom'
    },
    {
        id: 'booking-start-step',
        targetId: 'hero-book-btn',
        path: '/',
        title: 'Ready to Book?',
        content: 'Click here or navigate to the booking page to start hiring your professional help.',
        position: 'bottom'
    },
    {
        id: 'booking-service-step',
        targetId: 'booking-service-type',
        path: '/booking',
        title: 'Choose a Service',
        content: 'Select the type of help you need. We offer cooks, babysitters, and more!',
        position: 'bottom'
    },
    {
        id: 'booking-address-step',
        targetId: 'booking-address',
        path: '/booking',
        title: 'Where do you need us?',
        content: 'Provide your full address so our team can reach you easily.',
        position: 'bottom'
    },
    {
        id: 'booking-date-step',
        targetId: 'booking-date-time',
        path: '/booking',
        title: 'Set Date & Time',
        content: 'Choose your preferred date and time for the service to start.',
        position: 'bottom'
    },
    {
        id: 'booking-submit-step',
        targetId: 'booking-submit-btn',
        path: '/booking',
        title: 'Confirm Booking',
        content: 'Finalize your request by clicking the submit button. We\'ll handle the rest!',
        position: 'top'
    },
    {
        id: 'dashboard-step',
        targetId: 'dashboard-stats',
        path: '/dashboard',
        title: 'Your Dashboard',
        content: 'Monitor your bookings, track worker attendance, and manage your profile here.',
        position: 'bottom'
    },
    {
        id: 'attendance-step',
        targetId: 'dashboard-bookings-link',
        path: '/dashboard',
        title: 'Worker Attendance',
        content: 'View and mark daily attendance for your helpers directly from this section.',
        position: 'bottom'
    }
];

export function TutorialProvider({ children }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const auth = useAuth();
    const user = auth ? auth.user : null;

    const startTutorial = () => {
        if (!user) {
            toast.error('Please login to start the guided tour!');
            router.push('/login');
            return;
        }
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
