import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email } = await req.json(); // dynamic receiver

    const lowStock = await Product.find({
      currentStock: { $lt: 10 }
    });

    if (lowStock.length === 0) {
      return NextResponse.json({ message: "No low stock items" });
    }

    let message = 'Low Stock Alert:\n\n';

    lowStock.forEach((item) => {
      message += `${item.name} - ${item.currentStock} ${item.unit}\n`;
    });

    const htmlMessage = `
      <h2>Low Stock Alert 🚨</h2>
      <ul>
        ${lowStock.map(item => `<li>${item.name} - ${item.currentStock} ${item.unit}</li>`).join("")}
      </ul>
    `;

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
      from: `"Kirana Inventory System" <${process.env.EMAIL_USER}>`,
      to: email || "manogna.perka2005@gmail.com",
      subject: 'Low Stock Alert - Kirana Store',
      text: message,
      html: htmlMessage, // 🔥 professional email
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}