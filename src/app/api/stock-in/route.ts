import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { productId, quantity, price } = data;

        if (!productId || !quantity || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Update Product stock
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        product.currentStock += Number(quantity);

        // update status based on stock
        if (product.currentStock > 10) product.status = 'Active';
        else if (product.currentStock > 0) product.status = 'Low Stock';
        else product.status = 'Out of Stock';

        await product.save();

        // 2. Create Transaction
        const transaction = await Transaction.create({
            product: productId,
            type: 'IN',
            quantity: Number(quantity),
            price: Number(price),
            total: Number(quantity) * Number(price)
        });

        return NextResponse.json({ product, transaction }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
