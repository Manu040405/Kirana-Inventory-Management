"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Search, Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transaction {
    _id: string;
    type: 'IN' | 'OUT';
    quantity: number;
    price: number;
    total: number;
    date: string;
    productName: string;
    productUnit: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch transactions:", err);
                setLoading(false);
            });
    }, []);

    const filteredTransactions = transactions.filter(t =>
        t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Transaction Ledger</h1>
                    <p className="text-muted-foreground text-sm">Review your entire store's stock in and stock out history.</p>
                </div>
            </div>

            <div className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search product or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-2xl overflow-hidden shadow-sm bg-card ring-1 ring-border/50">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center p-12 text-muted-foreground">
                        No transactions found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[180px]">Date & Time</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Price per unit</TableHead>
                                    <TableHead className="text-right font-semibold">Total Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((tx) => (
                                    <TableRow key={tx._id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium text-muted-foreground">
                                            {format(new Date(tx.date), "dd MMM yyyy, hh:mm a")}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {tx.productName}
                                        </TableCell>
                                        <TableCell>
                                            {tx.type === 'IN' ? (
                                                <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-none px-2 rounded-md font-medium">
                                                    <ArrowDownLeft className="h-3 w-3 mr-1" />
                                                    Stock In
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-none px-2 rounded-md font-medium">
                                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                                    Stock Out
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-semibold">{tx.quantity}</span> <span className="text-muted-foreground text-xs">{tx.productUnit}</span>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            ₹{tx.price.toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-foreground">
                                            ₹{tx.total.toLocaleString('en-IN')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
