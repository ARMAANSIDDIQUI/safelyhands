"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";

export default function ImageUpload({ value, onChange, disabled }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Upload failed");
            }

            onChange(data.imageUrl);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="flex flex-col gap-4">
            {value ? (
                <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-slate-200">
                    <div className="absolute top-2 right-2 z-10">
                        <Button
                            type="button"
                            onClick={handleRemove}
                            variant="destructive"
                            size="icon"
                            disabled={disabled}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <img
                        src={value}
                        alt="Upload"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <Loader2 className="h-8 w-8 text-slate-400 animate-spin mb-2" />
                            ) : (
                                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            )}
                            <p className="mb-2 text-sm text-slate-500">
                                <span className="font-semibold">Click to upload</span>
                            </p>
                            <p className="text-xs text-slate-500">
                                SVG, PNG, JPG or GIF (MAX. 5MB)
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={disabled || isUploading}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
