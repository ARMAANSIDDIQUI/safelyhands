import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DynamicServiceModal({ isOpen, onClose, service, onConfirm, initialData = {}, activeShift }) {
    // 1. Initialize State
    const [answers, setAnswers] = useState(initialData);
    const [price, setPrice] = useState(service?.basePrice || 0);

    // 2. Initialize defaults on open
    useEffect(() => {
        if (isOpen && service?.questions) {
            const defaults = { ...initialData };
            let initialPrice = service.basePrice || 0;

            service.questions.forEach(step => {
                step.fields.forEach(field => {
                    // Set default if not present
                    if (defaults[field.name] === undefined && field.options?.[0]) {
                        defaults[field.name] = field.options[0].value;
                    }
                });
            });
            setAnswers(defaults);
        }
    }, [isOpen, service]);


    // 3. Calculate Price whenever answers change
    useEffect(() => {
        if (!service?.questions) return;

        let newPrice = service.basePrice || 0;
        service.questions.forEach(step => {
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
    }, [answers, service]);

    if (!isOpen || !service) return null;

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
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b pb-4">{service.title} Details</h2>

                    <div className="space-y-10">
                        {service.questions?.map((step, stepIndex) => (
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
                                                            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
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
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium mb-1">
                                Monthly Salary <span className="text-orange-400 font-bold">~₹{price}.00</span> approx.
                            </p>
                            <p className="text-sm text-slate-400">*estimate varies with workload</p>
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-[13px] text-slate-500 font-medium mb-1">
                                Daily Working Hours <span className="text-orange-400 font-bold">~{(() => {
                                    if (activeShift === "Hourly" && service.title?.toLowerCase().includes('hour')) {
                                        return service.title.split(' ')[0] + ':00';
                                    }
                                    if (service.slug?.includes('24hr')) return "24:00";
                                    return "12:00";
                                })()}</span> approx.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleConfirm}
                        className="w-full md:w-auto px-12 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                    >
                        Confirm & Done
                    </button>
                </div>
            </div>
        </div>
    );
}
