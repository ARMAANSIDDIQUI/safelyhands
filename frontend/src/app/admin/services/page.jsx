"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminServices() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        basePrice: "",
        features: "",
        imageUrl: ""
    });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
                const data = await res.json();
                if (Array.isArray(data)) setServices(data);
            } catch (err) {
                toast.error("Failed to fetch services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenDialog = (service = null) => {
        if (service) {
            setIsEditing(true);
            setCurrentServiceId(service._id);
            setFormData({
                title: service.title,
                slug: service.slug,
                description: service.description,
                basePrice: service.basePrice,
                features: service.features.join(", "),
                imageUrl: service.imageUrl || ""
            });
        } else {
            setIsEditing(false);
            setCurrentServiceId(null);
            setFormData({
                title: "",
                slug: "",
                description: "",
                basePrice: "",
                features: "",
                imageUrl: ""
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_API_URL}/services/${currentServiceId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/services`;
        const method = isEditing ? "PUT" : "POST";

        try {
            // Convert features string to array
            const payload = {
                ...formData,
                features: formData.features.split(",").map(f => f.trim()).filter(f => f)
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong");

            toast.success(isEditing ? "Service updated" : "Service created");
            setIsDialogOpen(false);
            fetchServices();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${user?.token}` }
            });

            if (res.ok) {
                toast.success("Service deleted");
                fetchServices();
            } else {
                toast.error("Failed to delete service");
            }
        } catch (error) {
            toast.error("Error deleting service");
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-slate-900">Manage Services</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Card key={service._id} className="flex flex-col">
                        <div className="relative h-48 w-full bg-slate-100 rounded-t-xl overflow-hidden">
                            {service.imageUrl ? (
                                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle>{service.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-sm font-medium text-slate-700 mb-2">Features:</div>
                            <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                                {service.features.slice(0, 3).map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                                {service.features.length > 3 && <li>+{service.features.length - 3} more</li>}
                            </ul>
                            <div className="mt-4 font-bold text-lg">₹{service.basePrice}</div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-4">
                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(service)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(service._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Service" : "Add New Service"}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the service here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="slug" className="text-right">Slug</Label>
                                <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} className="col-span-3" required disabled={isEditing} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="basePrice" className="text-right">Price (₹)</Label>
                                <Input id="basePrice" name="basePrice" type="number" value={formData.basePrice} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="features" className="text-right">Features</Label>
                                <Textarea id="features" name="features" value={formData.features} onChange={handleInputChange} placeholder="Comma separated list" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                                <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {isEditing ? "Save Changes" : "Create Service"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}