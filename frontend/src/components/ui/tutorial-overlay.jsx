"use client";

import React, { useEffect, useState } from 'react';
import { useTutorial } from '@/context/TutorialContext';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function TutorialOverlay() {
    const { isActive, currentStep, totalSteps, stepIndex, nextStep, prevStep, endTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState(null);

    useEffect(() => {
        if (isActive && currentStep) {
            const updatePosition = () => {
                const element = document.getElementById(currentStep.targetId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    setTargetRect({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                    });
                    // Scroll element into view
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // If element not found, retry after a short delay (for page transitions)
                    setTimeout(updatePosition, 500);
                }
            };

            // Initial update
            updatePosition();

            // Update on resize
            window.addEventListener('resize', updatePosition);
            return () => window.removeEventListener('resize', updatePosition);
        }
    }, [isActive, currentStep, stepIndex]); // Re-run when step changes

    if (!isActive || !currentStep || !targetRect) return null;

    // Calculate tooltip position
    const tooltipStyle = {};
    const margin = 20;

    if (currentStep.position === 'top') {
        tooltipStyle.bottom = window.innerHeight - targetRect.top + margin;
        tooltipStyle.left = targetRect.left + (targetRect.width / 2) - 150;
    } else if (currentStep.position === 'bottom') {
        tooltipStyle.top = targetRect.top + targetRect.height + margin;
        tooltipStyle.left = targetRect.left + (targetRect.width / 2) - 150;
    } else if (currentStep.position === 'left') {
        tooltipStyle.top = targetRect.top;
        tooltipStyle.right = window.innerWidth - targetRect.left + margin;
    } else { // right
        tooltipStyle.top = targetRect.top;
        tooltipStyle.left = targetRect.left + targetRect.width + margin;
    }

    // Ensure tooltip stays on screen
    if (tooltipStyle.left < 20) tooltipStyle.left = 20;
    // (Simplified collision detection)

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
            {/* Semi-transparent overlay with hole */}
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <mask id="hole">
                        <rect width="100%" height="100%" fill="white" />
                        <rect
                            x={targetRect.left - 5}
                            y={targetRect.top - 5}
                            width={targetRect.width + 10}
                            height={targetRect.height + 10}
                            rx="8"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.6)"
                    mask="url(#hole)"
                />
                {/* Highlight border */}
                <rect
                    x={targetRect.left - 5}
                    y={targetRect.top - 5}
                    width={targetRect.width + 10}
                    height={targetRect.height + 10}
                    rx="8"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="animate-pulse"
                />
            </svg>

            {/* Tooltip Card */}
            <div
                className="absolute pointer-events-auto bg-white p-6 rounded-xl shadow-2xl w-[320px] max-w-[90vw] animate-in fade-in zoom-in duration-300"
                style={tooltipStyle}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step {stepIndex + 1} of {totalSteps}</span>
                    <button onClick={endTutorial} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{currentStep.title}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {currentStep.content}
                </p>

                <div className="flex justify-between items-center">
                    {stepIndex > 0 ? (
                        <Button variant="outline" size="sm" onClick={prevStep} className="flex items-center gap-1">
                            <ChevronLeft size={14} /> Back
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    <Button size="sm" onClick={nextStep} className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700">
                        {stepIndex === totalSteps - 1 ? 'Finish' : 'Next'} <ChevronRight size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
