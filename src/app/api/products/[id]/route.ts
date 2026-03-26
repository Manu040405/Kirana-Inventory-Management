import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction'; // To possibly delete transactions linked to product

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const id = (await params).id;
        const product = await Product.findById(id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const id = (await params).id;
        const body = await req.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const id = (await params).id;

        // Check if the product exists
        const product = await Product.findById(id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        // Note: Do not permanently delete their transactions so you can preserve analytics!
        // But you can totally delete the product definition.
        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
