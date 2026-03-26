import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // price per unit at the time of transaction
    total: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
