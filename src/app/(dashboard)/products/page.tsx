"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Select";
import { Plus, Search, Edit2, Trash2, Loader2, Save, Tag } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    category?: string;
    unit: string;
    currentStock: number;
    price: number;
    icon: string;
    status: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Edit Modal State
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editUnit, setEditUnit] = useState("");
    const [saving, setSaving] = useState(false);

    // Create Category Modal State for inline creation inside Edit
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [savingCategory, setSavingCategory] = useState(false);

    useEffect(() => {
        let isMounted = true;
        Promise.all([
            fetch('/api/products').then(res => res.json()),
            fetch('/api/categories').then(res => res.json())
        ]).then(([productsData, categoriesData]) => {
            if (isMounted) {
                setProducts(productsData);
                setCategories(categoriesData.filter((c: { name: string }) => c.name !== 'Uncategorized').map((c: { name: string }) => c.name));
                setLoading(false);
            }
        }).catch(err => {
            console.error("Failed to fetch data:", err);
            if (isMounted) setLoading(false);
        });

        return () => { isMounted = false };
    }, []);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setSavingCategory(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });
            if (res.ok) {
                setCategories([...categories, newCategoryName]);
                setEditCategory(newCategoryName);
                setNewCategoryName("");
                setIsCategoryDialogOpen(false);
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (err) {
            console.error(err);
        }
        setSavingCategory(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete "${name}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert("Failed to delete product.");
            }
        } catch (err) {
            console.error("Error deleting:", err);
            alert("Error deleting product.");
        }
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setEditName(product.name);
        setEditCategory(product.category || "");
        setEditPrice(product.price.toString());
        setEditUnit(product.unit);
        setIsEditDialogOpen(true);
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        if (!editName || !editPrice || !editUnit) {
            return alert("Please fill all fields.");
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/products/${editingProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    category: editCategory,
                    price: Number(editPrice),
                    unit: editUnit
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setProducts(products.map(p => p._id === updated._id ? updated : p));
                setIsEditDialogOpen(false);
            } else {
                alert("Failed to update product.");
            }
        } catch (err) {
            console.error("Error updating:", err);
            alert("Error updating product.");
        }
        setSaving(false);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Product Inventory</h1>
                <Link href="/products/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">Filter</Button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground border rounded-lg">
                        {searchTerm ? "No products match your search." : "No products found. Add your first product!"}
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <Card key={product._id} className="overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="flex items-center p-4 gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                                        {product.icon || '📦'}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base">{product.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            {product.category && (
                                                <>
                                                    <Badge variant="outline" className="font-normal text-xs py-0 h-5 bg-background">
                                                        {product.category}
                                                    </Badge>
                                                    <span>•</span>
                                                </>
                                            )}
                                            <span>{product.unit}</span>
                                            <span>•</span>
                                            <span>Stock: <strong>{product.currentStock}</strong></span>
                                            <Badge variant={product.status === 'Active' ? 'secondary' : product.status === 'Low Stock' ? 'warning' : 'destructive'} className="ml-2 font-normal text-xs py-0 h-5">
                                                {product.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right mr-4 hidden sm:block">
                                        <div className="font-bold text-lg">₹{product.price}</div>
                                    </div>
                                    <div className="flex items-center gap-2 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)} className="text-blue-600 hover:bg-blue-50">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id, product.name)} className="text-red-500 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Product Dialog */}
            <Dialog
                isOpen={isEditDialogOpen}
                onClose={() => !saving && setIsEditDialogOpen(false)}
                title="Edit Product"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Name</label>
                        <Input
                            placeholder="e.g. Amul Milk 500ml"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select
                            options={categories}
                            value={editCategory}
                            onChange={setEditCategory}
                            onCreateNew={() => setIsCategoryDialogOpen(true)}
                            placeholder="Select Category"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Selling Price (₹)</label>
                            <Input
                                type="number"
                                placeholder="e.g. 50"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Unit</label>
                            <Input
                                placeholder="e.g. pkt, kg, ltr"
                                value={editUnit}
                                onChange={(e) => setEditUnit(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={handleUpdateProduct} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Create Category Dialog */}
            <Dialog
                isOpen={isCategoryDialogOpen}
                onClose={() => setIsCategoryDialogOpen(false)}
                title="Create New Category"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            placeholder="e.g. Frozen Foods"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} disabled={savingCategory}>Cancel</Button>
                        <Button onClick={handleCreateCategory} disabled={savingCategory}>
                            {savingCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Category
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
