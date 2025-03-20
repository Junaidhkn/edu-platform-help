'use client';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// Define the transaction type
type Transaction = {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
};

type SortField = 'createdAt' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortField === 'status') {
      return sortDirection === 'asc' 
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('createdAt')}
                className="flex items-center p-0 h-auto font-medium"
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('amount')}
                className="flex items-center p-0 h-auto font-medium"
              >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('status')}
                className="flex items-center p-0 h-auto font-medium"
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Stripe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  <Link href={`/dashboard/orders/${transaction.orderId}`} className="text-blue-500 hover:underline">
                    {transaction.orderId.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>{transaction.user?.email || transaction.userId.substring(0, 8)}</TableCell>
                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${(transaction.amount / 100).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.stripePaymentIntentId && (
                    <Link 
                      href={`https://dashboard.stripe.com/payments/${transaction.stripePaymentIntentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" /> Stripe
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 