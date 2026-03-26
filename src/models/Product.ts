import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    unit: { type: String, required: true },
    currentStock: { type: Number, default: 0 },
    price: { type: Number, required: true }, // Selling price
    icon: { type: String, default: '📦' },
    status: { type: String, enum: ['Active', 'Low Stock', 'Out of Stock'], default: 'Active' }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
