import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        // Check if id is uncategorized
        if (id === 'uncategorized-id') {
            const newName = body.name;
            if (!newName || newName === 'Uncategorized') {
                return NextResponse.json({ error: "Please provide a valid new category name." }, { status: 400 });
            }

            // Check if name already exists
            let category = await Category.findOne({ name: { $regex: new RegExp(`^${newName}$`, 'i') } });

            // If doesn't exist, create it
            if (!category) {
                category = await Category.create({ name: newName });
            }

            // Update all products that are currently uncategorized
            const Product = (await import('@/models/Product')).default;
            await Product.updateMany(
                { $or: [{ category: null }, { category: "" }, { category: "Uncategorized" }] },
                { $set: { category: category.name } }
            );

            return NextResponse.json({ _id: 'uncategorized-id', name: category.name, count: 0 }); // Count updated on next fetch
        }

        const updated = await Category.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        // Check if id is uncategorized
        if (id === 'uncategorized-id') {
            return NextResponse.json({ error: "Cannot delete the default Uncategorized category" }, { status: 400 });
        }

        const category = await Category.findById(id);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        await Category.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Delete failed" }, { status: 500 });
    }
}
