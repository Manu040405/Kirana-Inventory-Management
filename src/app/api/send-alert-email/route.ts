import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    await dbConnect();

    const lowStock = await Product.find({
      currentStock: { $lt: 10 }
    });

    let message = 'Low Stock Alert:\n\n';

    lowStock.forEach((item) => {
      message += `${item.name} - ${item.currentStock} ${item.unit}\n`;
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Low Stock Alert - Kirana Store',
      text: message,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}