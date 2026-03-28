import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await dbConnect();

    const transactions = await Transaction.find({}).populate('product');

    let csv = 'Date,Product,Type,Quantity,Total Amount\n';

    transactions.forEach((t) => {
      const date = new Date(t.createdAt).toISOString().split('T')[0];
      const productName = (t.product as any)?.name || 'Deleted Product';

      csv += `${date},${productName},${t.type},${t.quantity},${t.total}\n`;
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="inventory_report.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}