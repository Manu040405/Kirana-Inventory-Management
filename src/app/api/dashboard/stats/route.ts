import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction';

export async function GET() {
    try {
        await dbConnect();

        // 1. Total Products Count
        const totalProducts = await Product.countDocuments();

        // 2. Low Stock Alerts
        const lowStockItems = await Product.find({ currentStock: { $lt: 10, $gt: 0 } });
        const outOfStockItems = await Product.find({ currentStock: 0 });

        // 3. Total Stock Value
        const allProducts = await Product.find({});
        const totalStockValue = allProducts.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

        // 4. Added recently (last 30 days stock in/out)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newItemsAdded = await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // 5. Recent Alerts formatted for Dashboard
        const alerts = [
            ...outOfStockItems.map(item => ({
                id: item._id,
                title: item.name,
                stock: `${item.currentStock} units left`,
                icon: item.icon,
                tag: 'Critical'
            })),
            ...lowStockItems.map(item => ({
                id: item._id,
                title: item.name,
                stock: `${item.currentStock} units left`,
                icon: item.icon,
                tag: 'Warning'
            }))
        ];

        return NextResponse.json({
            totalProducts,
            totalStockValue,
            newItemsAdded,
            lowStockCount: lowStockItems.length + outOfStockItems.length,
            alerts: alerts.slice(0, 5) // top 5 alerts
        });

    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
