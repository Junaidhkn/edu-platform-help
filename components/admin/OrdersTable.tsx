'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface OrdersTableProps {
  orders: any[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Academic Level</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.slice(-6)}</TableCell>
                <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                <TableCell>{order.subjectCategory}</TableCell>
                <TableCell>{order.academicLevel}</TableCell>
                <TableCell>
                  {order.deadline ? format(new Date(order.deadline), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>{formatCurrency(Number(order.total_price) || 0)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.orderStatus)}>
                    {order.orderStatus || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                    
                    {order.orderStatus === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => router.push(`/dashboard/orders/${order.id}/accept`)}
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Accept
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => router.push(`/dashboard/orders/${order.id}/reject`)}
                        >
                          <XCircle size={16} className="mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 