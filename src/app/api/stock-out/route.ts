import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { productId, quantity } = data;

        if (!productId || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const qty = Number(quantity);

        // 1. Find Product
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.currentStock < qty) {
            return NextResponse.json({ error: 'Not enough stock' }, { status: 400 });
        }

        // 2. Reduce stock
        product.currentStock -= qty;

        if (product.currentStock > 10) product.status = 'Active';
        else if (product.currentStock > 0) product.status = 'Low Stock';
        else product.status = 'Out of Stock';

        await product.save();

        // 3. Create Transaction
        const transaction = await Transaction.create({
            product: productId,
            type: 'OUT',
            quantity: qty,
            price: product.price, // assuming selling price from product
            total: product.price * qty
        });

        return NextResponse.json({ product, transaction }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
