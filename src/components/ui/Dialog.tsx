"use client";

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0">
            <div className="relative w-full max-w-md gap-4 border bg-background p-6 shadow-lg sm:rounded-2xl animate-in fade-in-0 zoom-in-95">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
                    <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
                </div>
                {children}
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    )
}
