import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Product from '@/models/Product'; // needed for population

export async function GET() {
    try {
        await dbConnect();
        // Fetch all transactions, sorted by newest first, and populate product name
        const transactions = await Transaction.find({})
            .populate('product', 'name unit')
            .sort({ createdAt: -1 })
            .lean();

        // Map to a friendlier format for the frontend
        const formatted = transactions.map((t: any) => ({
            _id: t._id.toString(),
            type: t.type,
            quantity: t.quantity,
            price: t.price,
            total: t.total,
            date: t.createdAt,
            productName: t.product ? t.product.name : 'Unknown/Deleted Product',
            productUnit: t.product ? t.product.unit : ''
        }));

        return NextResponse.json(formatted);
    } catch (error: any) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
