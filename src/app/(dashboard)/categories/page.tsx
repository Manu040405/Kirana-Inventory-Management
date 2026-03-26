"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Plus, Edit2, Trash2, Layers, Loader2 } from "lucide-react";

interface Category {
    _id: string; // From MongoDB
    name: string;
    description?: string;
    count: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Create Modal
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newCatName, setNewCatName] = useState("");

    // Edit Modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editCatId, setEditCatId] = useState("");
    const [editCatName, setEditCatName] = useState("");

    const [processing, setProcessing] = useState(false);

    const fetchCategories = () => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch categories:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = async () => {
        if (!newCatName.trim()) return;
        setProcessing(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName })
            });
            if (res.ok) {
                setNewCatName("");
                setIsCreateOpen(false);
                fetchCategories();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (err) {
            console.error(err);
        }
        setProcessing(false);
    };

    const handleUpdateCategory = async () => {
        if (!editCatName.trim()) return;
        setProcessing(true);
        try {
            const res = await fetch(`/api/categories/${editCatId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editCatName })
            });
            if (res.ok) {
                setEditCatId("");
                setEditCatName("");
                setIsEditOpen(false);
                fetchCategories();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (err) {
            console.error(err);
        }
        setProcessing(false);
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (id === 'uncategorized-id') {
            return alert("You cannot delete the 'Uncategorized' default category.");
        }
        if (!confirm(`Are you sure you want to permanently delete the category "${name}"?`)) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCategories();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            alert("Error deleting category.");
        }
    };

    const openEditModal = (cat: Category) => {
        setEditCatId(cat._id);
        setEditCatName(cat.name);
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground text-sm">Organize your inventory with custom categories.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
                        <Card key={cat._id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-primary" />
                                    {cat.name}
                                </CardTitle>
                                {cat._id !== 'uncategorized-id' ? (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditModal(cat)} className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat._id, cat.name)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditModal(cat)} title="Rename Category" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" disabled title="Cannot delete default category" className="h-8 w-8 p-0 opacity-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mt-4 text-sm">
                                    <span className="text-2xl font-bold">{cat.count}</span>
                                    <span className="text-muted-foreground mt-1 tracking-tight">products linked</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Category Dialog */}
            <Dialog
                isOpen={isCreateOpen}
                onClose={() => !processing && setIsCreateOpen(false)}
                title="Create New Category"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            placeholder="e.g. Personal Care"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">This category will be available when adding products.</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={processing}>Cancel</Button>
                        <Button onClick={handleCreateCategory} disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Category
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog
                isOpen={isEditOpen}
                onClose={() => !processing && setIsEditOpen(false)}
                title="Edit Category Name"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            placeholder="e.g. Personal Care"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={processing}>Cancel</Button>
                        <Button onClick={handleUpdateCategory} disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
