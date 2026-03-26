"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// Since I cannot easily install radix-ui/react-select without user permission or risk (it might fail if npm issues), 
// I will build a custom Select component from scratch using standard React to ensure it works 100% without external deps matching the style.
// If the user hasn't explicitly asked for radix, I'll stick to a custom implementation to be safe and fast.

interface SelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onCreateNew?: () => void;
}

export function Select({ options, value, onChange, placeholder = "Select...", onCreateNew }: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    !value && "text-muted-foreground"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
                    <div className="p-1">
                        {options.map((option) => (
                            <div
                                key={option}
                                className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                    value === option && "bg-accent text-accent-foreground"
                                )}
                                onClick={() => handleSelect(option)}
                            >
                                <span className={cn("mr-2 flex h-4 w-4 items-center justify-center opacity-0", value === option && "opacity-100")}>
                                    <Check className="h-4 w-4" />
                                </span>
                                {option}
                            </div>
                        ))}
                        {onCreateNew && (
                            <div
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-8 py-1.5 text-sm outline-none transition-colors text-primary font-medium hover:bg-accent hover:text-accent-foreground border-t mt-1"
                                onClick={() => {
                                    onCreateNew();
                                    setIsOpen(false);
                                }}
                            >
                                + Create New Category
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
