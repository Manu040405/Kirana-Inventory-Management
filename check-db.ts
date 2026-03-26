import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.MONGODB_URI as string);

const ProductSchema = new mongoose.Schema({
    name: String,
    currentStock: Number,
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const TransactionSchema = new mongoose.Schema({
    type: String,
    quantity: Number,
});
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

async function main() {
    console.log("Products:", await Product.find({}));
    console.log("Transactions:", await Transaction.find({}));
    process.exit(0);
}
main();
