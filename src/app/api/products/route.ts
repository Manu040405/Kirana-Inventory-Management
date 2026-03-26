import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const product = await Product.create(data);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
