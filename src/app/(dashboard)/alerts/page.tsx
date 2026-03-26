"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Loader2 } from "lucide-react"

interface Product {
    _id: string;
    name: string;
    unit: string;
    currentStock: number;
}

export default function AlertsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setLoading(false);
            });
    }, []);

    const lowStockItems = products.filter(p => p.currentStock < 10);

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">Alerts & Notification</h1>
            </div>

            <div className="space-y-4">
                {/* Alerts Sections */}
                <section>
                    <h2 className="text-lg font-semibold mb-3">Low Stock Alerts</h2>
                    <Card>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : lowStockItems.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No low stock alerts! Inventory is healthy.
                                </div>
                            ) : (
                                lowStockItems.map((item) => (
                                    <div key={item._id} className="p-4 border-b last:border-0 hover:bg-muted/50 transition-colors flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Current Stock: <span className="text-destructive font-bold">{item.currentStock} {item.unit}</span>
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="border-warning text-warning">Reorder</Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}
