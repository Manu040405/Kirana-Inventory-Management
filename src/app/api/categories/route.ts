import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all categories
        const categories = await Category.find({}).lean();

        // Get product counts per category
        const categoriesAggr = await Product.aggregate([
            {
                $group: {
                    _id: { $ifNull: ["$category", "Uncategorized"] },
                    count: { $sum: 1 }
                }
            }
        ]);

        const countMap: Record<string, number> = {};
        categoriesAggr.forEach(c => {
            countMap[c._id] = c.count;
        });

        // Map categories with their respective counts
        const categoriesList = categories.map((c: any) => ({
            _id: c._id.toString(),
            name: c.name,
            description: c.description,
            color: c.color,
            count: countMap[c.name] || 0
        }));

        // Include "Uncategorized" if any exist that don't match a formal Category
        if (countMap['Uncategorized']) {
            categoriesList.push({
                _id: 'uncategorized-id',
                name: 'Uncategorized',
                description: 'Items without a category',
                color: '#9ca3af',
                count: countMap['Uncategorized']
            });
        }

        return NextResponse.json(categoriesList.sort((a, b) => b.count - a.count));
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, description, color } = body;

        const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (exists) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const category = await Category.create({ name, description, color });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create category" }, { status: 500 });
    }
}
