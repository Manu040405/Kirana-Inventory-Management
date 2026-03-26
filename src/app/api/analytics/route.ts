import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        // 1. Get transactions over time (last 30 days or general trend)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactionsTrend = await Transaction.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        type: "$type"
                    },
                    totalAmount: { $sum: "$total" },
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        // Format trend data for Recharts (merge IN and OUT per date)
        const trendMap: Record<string, { date: string, StockIn: number, StockOut: number }> = {};
        transactionsTrend.forEach((t) => {
            const date = t._id.date;
            if (!trendMap[date]) trendMap[date] = { date, StockIn: 0, StockOut: 0 };

            if (t._id.type === 'IN') trendMap[date].StockIn += t.totalQuantity;
            if (t._id.type === 'OUT') trendMap[date].StockOut += t.totalQuantity;
        });

        // Sort array based on dates
        const trends = Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));

        // 2. Get Top Selling Products (Stock Out)
        const topSelling = await Transaction.aggregate([
            { $match: { type: 'OUT' } },
            {
                $group: {
                    _id: "$product",
                    totalQuantitySold: { $sum: "$quantity" },
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 5 }
        ]);

        // Populate product names
        const topProductsIds = topSelling.map(t => t._id);
        const products = await Product.find({ _id: { $in: topProductsIds } }).select('name').lean() as unknown as Array<{ _id: string | { toString: () => string }, name: string }>;

        const topProductsStats = topSelling.map(t => {
            const prod = products.find(p => p._id.toString() === t._id.toString());
            return {
                name: prod ? prod.name : 'Deleted Product',
                sold: t.totalQuantitySold,
                revenue: t.revenue
            };
        });

        // 3. Get Category Sales Distribution (Pie Chart mapping)
        const allOutTransactions = await Transaction.aggregate([
            { $match: { type: 'OUT' } },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productDoc"
                }
            },
            { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: { $ifNull: ["$productDoc.category", "Uncategorized"] },
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        const categorySales = allOutTransactions.map(c => ({
            name: c._id,
            value: c.revenue
        }));

        return NextResponse.json({
            trends,
            topSelling: topProductsStats,
            categorySales
        });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
