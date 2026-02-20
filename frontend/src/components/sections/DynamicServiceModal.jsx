import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DynamicServiceModal({ isOpen, onClose, subCategory, onConfirm, initialData = {} }) {
    // 1. Initialize State
    const [answers, setAnswers] = useState(initialData);
    const [price, setPrice] = useState(subCategory?.price || 0);

    // 2. Initialize defaults on open
    useEffect(() => {
        if (isOpen && subCategory?.questions) {
            const defaults = { ...initialData };
            let initialPrice = subCategory.price || 0;

            subCategory.questions.forEach(step => {
                step.fields.forEach(field => {
                    // Set default if not present
                    if (defaults[field.name] === undefined && field.options?.[0]) {
                        defaults[field.name] = field.options[0].value;
                    }
                });
            });
            setAnswers(defaults);
            setPrice(initialPrice); // Reset price base
        }
    }, [isOpen, subCategory]);


    // 3. Calculate Price whenever answers change
    useEffect(() => {
        if (!subCategory?.questions) return;

        let newPrice = subCategory.price || 0;
        subCategory.questions.forEach(step => {
            step.fields.forEach(field => {
                const selectedValue = answers[field.name];
                // Find selected option
                const option = field.options?.find(opt => opt.value === selectedValue);
                if (option?.priceChange) {
                    newPrice += option.priceChange;
                }
            });
        });
        setPrice(newPrice);
    }, [answers, subCategory]);

    if (!isOpen || !subCategory) return null;

    const handleConfirm = () => {
        onConfirm(answers, price);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="absolute top-6 right-6 z-10">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4">{subCategory.name} Details</h2>

                    <div className="space-y-10">
                        {subCategory.questions?.map((step, stepIndex) => (
                            <div key={stepIndex} className="space-y-8">
                                {step.fields.map((field, fieldIndex) => (
                                    <div key={fieldIndex}>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">{field.label}</h3>
                                        <p className="text-sm text-slate-400 mb-6 font-medium text-slate-500">
                                            Select 1 out of {field.options.length} options
                                        </p>

                                        <div className="flex flex-wrap gap-3">
                                            {field.options.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setAnswers({ ...answers, [field.name]: option.value })}
                                                    className={cn(
                                                        "px-6 py-3 rounded-xl border-2 font-bold transition-all text-left",
                                                        answers[field.name] === option.value
                                                            ? "border-sky-500 bg-sky-50 text-sky-600 shadow-sm"
                                                            : "border-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {option.label}
                                                    {option.priceChange > 0 && (
                                                        <span className="text-xs ml-2 text-slate-500 opacity-70">
                                                            (+₹{option.priceChange})
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Inclusions Section */}
                        {subCategory.inclusions && (
                            <div className="mt-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Inclusions</h3>
                                <div
                                    className="inclusions-content text-sm text-slate-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: subCategory.inclusions }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium mb-1">
                                Monthly Salary <span className="text-sky-400 font-bold">~₹{price}.00</span> approx.
                            </p>
                            <p className="text-sm text-slate-400">*estimate varies with workload</p>
                        </div>
                    </div>
                    <button
                        onClick={handleConfirm}
                        className="w-full md:w-auto px-12 py-4 bg-sky-500 text-white rounded-xl font-bold text-lg hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
                    >
                        Confirm & Done
                    </button>
                </div>
            </div>
        </div>
    );
}
