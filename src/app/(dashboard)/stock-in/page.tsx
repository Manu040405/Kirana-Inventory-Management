"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { ScanLine, Loader2 } from "lucide-react"

interface Product {
    _id: string;
    name: string;
    unit: string;
    price: number;
}

export default function StockInPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setInitialLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
                setInitialLoading(false);
            });
    }, []);

    const selectedProductObj = products.find(p => p._id === selectedProduct);

    const handleSubmit = async () => {
        if (!selectedProduct || !quantity || !price) return alert("Please fill all fields");

        setLoading(true);
        try {
            const res = await fetch('/api/stock-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selectedProduct,
                    quantity,
                    price
                })
            });

            if (res.ok) {
                alert("Stock added successfully!");
                setQuantity("");
                setPrice("");
                setSelectedProduct("");
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add stock");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">Stock In Entry</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Batch</CardTitle>
                    <CardDescription>Record purchase of items from supplier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {initialLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Product</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                >
                                    <option value="">-- Choose Product --</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Quantity</label>
                                    <Input type="number" placeholder="e.g. 50" value={quantity} onChange={e => setQuantity(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Unit</label>
                                    <Input placeholder="Unit" disabled value={selectedProductObj?.unit || ""} />
                                </div>
                            </div>


                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cost Price per unit (₹)</label>
                                    <Input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current Selling Price (₹)</label>
                                    <Input type="number" placeholder="0.00" disabled value={selectedProductObj?.price || ""} />
                                </div>
                            </div>

                            <Button className="w-full size-lg mt-4" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Add Stock
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
