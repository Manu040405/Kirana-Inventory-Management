import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    color: { type: String, default: "#3b82f6" }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
