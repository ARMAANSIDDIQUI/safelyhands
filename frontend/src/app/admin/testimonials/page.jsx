"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Loader2, Quote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/ui/image-upload";

export default function AdminTestimonials() {
    const { user, loading: authLoading } = useAuth();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        message: "",
        rating: 5,
        imageUrl: "",
        isActive: true
    });

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/admin`, {
                headers: { "Authorization": `Bearer ${user?.token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setTestimonials(data);
        } catch (err) {
            toast.error("Failed to fetch testimonials");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user?.token) {
                fetchTestimonials();
            } else {
                setLoading(false);
            }
        }
    }, [user, authLoading]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleOpenDialog = (item = null) => {
        if (item) {
            setIsEditing(true);
            setCurrentId(item._id);
            setFormData({
                name: item.name,
                role: item.role,
                message: item.message,
                rating: item.rating,
                imageUrl: item.imageUrl || "",
                isActive: item.isActive
            });
        } else {
            setIsEditing(false);
            setCurrentId(null);
            setFormData({
                name: "",
                role: "",
                message: "",
                rating: 5,
                imageUrl: "",
                isActive: true
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing
            ? `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${currentId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/testimonials`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong");

            toast.success(isEditing ? "Testimonial updated" : "Testimonial added");
            setIsDialogOpen(false);
            fetchTestimonials();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${user?.token}` }
            });

            if (res.ok) {
                toast.success("Testimonial deleted");
                fetchTestimonials();
            } else {
                toast.error("Failed to delete testimonial");
            }
        } catch (error) {
            toast.error("Error deleting testimonial");
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-slate-900">Manage Testimonials</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed">
                        <Quote className="h-12 w-12 mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No Testimonials Yet</h3>
                        <p className="mb-4">Add customer reviews to build trust.</p>
                        <Button onClick={() => handleOpenDialog()}>Add Testimonial</Button>
                    </div>
                ) : (
                    testimonials.map((item) => (
                        <Card key={item._id} className="flex flex-col relative overflow-hidden">
                            <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                                <Quote size={80} />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                                                {item.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{item.name}</CardTitle>
                                        <CardDescription className="text-xs">{item.role}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <p className="text-sm text-slate-600 italic">"{item.message}"</p>
                                <div className="flex justify-between items-center">
                                    <Badge variant={item.isActive ? "default" : "secondary"}>
                                        {item.isActive ? "Active" : "Hidden"}
                                    </Badge>
                                    <div className="text-yellow-500 font-bold text-sm">
                                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-slate-50/50">
                                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                        <DialogDescription>
                            Share what customers are saying about Safely Hands.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Role</Label>
                                <Input id="role" name="role" value={formData.role} onChange={handleInputChange} className="col-span-3" placeholder="e.g. Home Maker" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="message" className="text-right">Message</Label>
                                <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rating" className="text-right">Rating (1-5)</Label>
                                <Input id="rating" name="rating" type="number" min="1" max="5" value={formData.rating} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Image</Label>
                                <div className="col-span-3">
                                    <ImageUpload
                                        value={formData.imageUrl}
                                        onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="isActive" className="text-right">Visible</Label>
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">
                                {isEditing ? "Save Changes" : "Add Testimonial"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
