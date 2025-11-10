'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useAuth } from "@/hooks/use-auth";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Transaction } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

function TransactionRowSkeleton() {
    return (
        <TableRow>
            <TableCell className="w-12"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
        </TableRow>
    )
}

export function TransactionList() {
    const { user } = useAuth();
    const db = useFirestore();

    const transactionsQuery = useMemoFirebase(() => {
        if (!db || !user?.uid) return null;
        return query(
            collection(db, 'users', user.uid, 'transactions'),
            orderBy('createdAt', 'desc'),
            limit(10)
        );
    }, [db, user?.uid]);

    const { data: transactions, isLoading } = useCollection<Transaction>(transactionsQuery);

    const getIcon = (type: string) => {
        switch (type) {
            case 'earn':
                return <ArrowUpRight className="h-5 w-5 text-green-400" />;
            case 'payout':
                return <ArrowDownLeft className="h-5 w-5 text-red-400" />;
            default:
                return <ArrowUpRight className="h-5 w-5 text-green-400" />;
        }
    }

    if (isLoading) {
        return (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TransactionRowSkeleton />
                    <TransactionRowSkeleton />
                    <TransactionRowSkeleton />
                </TableBody>
             </Table>
        )
    }

    if (!transactions || transactions.length === 0) {
        return <p className="text-center text-muted-foreground p-8">No recent transactions.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map(tx => (
                    <TableRow key={tx.id}>
                        <TableCell>
                            <div className="flex items-center justify-center bg-card/50 h-10 w-10 rounded-full">
                               {getIcon(tx.type)}
                            </div>
                        </TableCell>
                        <TableCell>
                            <p className="font-medium">{tx.description}</p>
                            <Badge variant="secondary" className="font-mono text-xs mt-1">{tx.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                            {tx.createdAt ? formatDistanceToNow(tx.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right font-semibold font-headline">
                           {tx.type === 'earn' ? '+' : '-'}{tx.amount.toLocaleString()} CASH
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
