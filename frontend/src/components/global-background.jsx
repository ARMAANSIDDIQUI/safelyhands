"use client";

import { usePathname } from "next/navigation";
import ThreeDBackground from "./three-d-background";

export default function GlobalBackground() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return null;

    return <ThreeDBackground />;
}
