"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import { getToken } from '@/lib/auth';

export default function EditServicePage({ params }) {
    const router = useRouter();
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [service, setService] = useState({
        title: '',
        slug: '',
        category: '',
        description: '',
        basePrice: 0,
        subcategories: [],
        questions: []
    });

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`);
            if (res.ok) {
                const data = await res.json();
                setService(data);
            } else {
                toast.error("Failed to load service");
                router.push('/admin/services');
            }
        } catch (error) {
            toast.error("Error loading service");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(service)
            });

            if (res.ok) {
                toast.success("Service updated successfully");
                router.push('/admin/services');
            } else {
                toast.error("Failed to update service");
            }
        } catch (error) {
            toast.error("Error updating service");
        } finally {
            setSaving(false);
        }
    };

    const addSubcategory = () => {
        setService(prev => ({
            ...prev,
            subcategories: [...(prev.subcategories || []), {
                name: "New Subcategory",
                price: "₹0",
                description: "",
                image: "",
                features: []
            }]
        }));
    };

    const updateSubcategory = (index, field, value) => {
        const updated = [...(service.subcategories || [])];
        if (field === 'features') {
            updated[index][field] = value.split(',').map(s => s.trim());
        } else {
            updated[index][field] = value;
        }
        setService({ ...service, subcategories: updated });
    };

    const removeSubcategory = (index) => {
        if (!confirm("Remove this subcategory?")) return;
        const updated = [...(service.subcategories || [])];
        updated.splice(index, 1);
        setService({ ...service, subcategories: updated });
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Edit Service</h1>
                        <p className="text-slate-500">Editing {service.title} ({service.slug})</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Basic Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Basic Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                            value={service.title}
                            onChange={(e) => setService({ ...service, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Slug</label>
                        <input
                            type="text"
                            disabled
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                            value={service.slug}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Base Price</label>
                        <input
                            type="number"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                            value={service.basePrice}
                            onChange={(e) => setService({ ...service, basePrice: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                            value={service.category}
                            onChange={(e) => setService({ ...service, category: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 h-24 resize-none"
                            value={service.description}
                            onChange={(e) => setService({ ...service, description: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Subcategories Editor */}
            <div id="subcategories" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Subcategories</h2>
                    <button onClick={addSubcategory} className="text-blue-500 font-bold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Plus size={16} /> Add New
                    </button>
                </div>

                <div className="space-y-6">
                    {service.subcategories?.length === 0 && (
                        <p className="text-slate-400 italic text-center py-4">No subcategories. Add one to start.</p>
                    )}
                    {service.subcategories?.map((sub, index) => (
                        <div key={index} className="border-2 border-slate-100 rounded-xl p-6 relative group">
                            <button
                                onClick={() => removeSubcategory(index)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                        value={sub.name}
                                        onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Price Label</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                        value={sub.price}
                                        onChange={(e) => updateSubcategory(index, 'price', e.target.value)}
                                        placeholder="e.g. ₹25000/month"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                        value={sub.description}
                                        onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                        value={sub.image}
                                        onChange={(e) => updateSubcategory(index, 'image', e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Features (comma separated)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                        value={sub.features?.join(', ')}
                                        onChange={(e) => updateSubcategory(index, 'features', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Question Builder */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Dynamic Questions</h2>
                        <p className="text-slate-500 text-sm">Define steps and questions for the service wizard</p>
                    </div>
                    <button
                        onClick={() => setService(prev => ({
                            ...prev,
                            questions: [...(prev.questions || []), { stepTitle: "New Step", fields: [] }]
                        }))}
                        className="text-blue-500 font-bold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> Add Step
                    </button>
                </div>

                <div className="space-y-8">
                    {service.questions?.map((step, stepIndex) => (
                        <div key={stepIndex} className="border-2 border-slate-100 rounded-xl p-6 relative bg-slate-50/50">
                            {/* Step Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-slate-200 text-slate-600 font-bold px-3 py-1 rounded text-xs">Step {stepIndex + 1}</span>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none font-bold text-slate-800 text-lg px-2 py-1 transition-colors"
                                    value={step.stepTitle}
                                    placeholder="Step Title (e.g. Details)"
                                    onChange={(e) => {
                                        const updated = [...service.questions];
                                        updated[stepIndex].stepTitle = e.target.value;
                                        setService({ ...service, questions: updated });
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        if (!confirm("Remove this step?")) return;
                                        const updated = [...service.questions];
                                        updated.splice(stepIndex, 1);
                                        setService({ ...service, questions: updated });
                                    }}
                                    className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Fields */}
                            <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                                {step.fields.map((field, fieldIndex) => (
                                    <div key={fieldIndex} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Label</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-50 border border-slate-100 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                                        value={field.label}
                                                        onChange={(e) => {
                                                            const updated = [...service.questions];
                                                            updated[stepIndex].fields[fieldIndex].label = e.target.value;
                                                            setService({ ...service, questions: updated });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">JSON Key</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-slate-50 border border-slate-100 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none font-mono"
                                                        value={field.name}
                                                        onChange={(e) => {
                                                            const updated = [...service.questions];
                                                            updated[stepIndex].fields[fieldIndex].name = e.target.value;
                                                            setService({ ...service, questions: updated });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</label>
                                                    <select
                                                        className="w-full bg-slate-50 border border-slate-100 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                                        value={field.type}
                                                        onChange={(e) => {
                                                            const updated = [...service.questions];
                                                            updated[stepIndex].fields[fieldIndex].type = e.target.value;
                                                            setService({ ...service, questions: updated });
                                                        }}
                                                    >
                                                        <option value="radio">Radio Buttons</option>
                                                        <option value="select">Dropdown</option>
                                                        <option value="checkbox">Checkbox</option>
                                                        <option value="text">Text Input</option>
                                                        <option value="date">Date Picker</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center pt-5">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required !== false}
                                                            onChange={(e) => {
                                                                const updated = [...service.questions];
                                                                updated[stepIndex].fields[fieldIndex].required = e.target.checked;
                                                                setService({ ...service, questions: updated });
                                                            }}
                                                            className="rounded text-blue-500 focus:ring-blue-500"
                                                        />
                                                        <span className="text-xs font-bold text-slate-600">Required</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const updated = [...service.questions];
                                                    updated[stepIndex].fields.splice(fieldIndex, 1);
                                                    setService({ ...service, questions: updated });
                                                }}
                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Options Editor for Radio/Select */}
                                        {(field.type === 'radio' || field.type === 'select') && (
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Options</span>
                                                    <button
                                                        onClick={() => {
                                                            const updated = [...service.questions];
                                                            updated[stepIndex].fields[fieldIndex].options.push({ label: "New Option", value: "new_val", priceChange: 0 });
                                                            setService({ ...service, questions: updated });
                                                        }}
                                                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        <Plus size={12} /> Add Option
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {field.options?.map((opt, optIndex) => (
                                                        <div key={optIndex} className="flex gap-2 items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Label"
                                                                className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                                                                value={opt.label}
                                                                onChange={(e) => {
                                                                    const updated = [...service.questions];
                                                                    updated[stepIndex].fields[fieldIndex].options[optIndex].label = e.target.value;
                                                                    setService({ ...service, questions: updated });
                                                                }}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Value"
                                                                className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none font-mono"
                                                                value={opt.value}
                                                                onChange={(e) => {
                                                                    const updated = [...service.questions];
                                                                    updated[stepIndex].fields[fieldIndex].options[optIndex].value = e.target.value;
                                                                    setService({ ...service, questions: updated });
                                                                }}
                                                            />
                                                            <div className="relative w-24">
                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Price"
                                                                    className="w-full bg-white border border-slate-200 rounded pl-5 pr-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                                                                    value={opt.priceChange}
                                                                    onChange={(e) => {
                                                                        const updated = [...service.questions];
                                                                        updated[stepIndex].fields[fieldIndex].options[optIndex].priceChange = parseFloat(e.target.value) || 0;
                                                                        setService({ ...service, questions: updated });
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    const updated = [...service.questions];
                                                                    updated[stepIndex].fields[fieldIndex].options.splice(optIndex, 1);
                                                                    setService({ ...service, questions: updated });
                                                                }}
                                                                className="text-slate-300 hover:text-red-500"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    onClick={() => {
                                        const updated = [...service.questions];
                                        updated[stepIndex].fields.push({
                                            name: "new_field",
                                            label: "New Field",
                                            type: "radio",
                                            options: [],
                                            required: true
                                        });
                                        setService({ ...service, questions: updated });
                                    }}
                                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add Field
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
