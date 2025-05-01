import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Mail, UserPlus } from 'lucide-react';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Order Details | Admin Dashboard',
  description: 'View and manage order details',
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }
  
  // Fetch order with relations
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, params.id),
    with: {
      user: true,
      freelancer: true,
    },
  });

  console.log('dashboard page file link check',order)
  
  if (!order) {
    redirect('/dashboard/orders');
  }
  
  // Function to determine badge color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
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
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Details */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Order #{order.id.slice(-6)}
              </h1>
              <Badge className={getStatusColor(order.orderStatus)}>
                {order.orderStatus.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{order.subjectCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{order.typeCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Academic Level</p>
                    <p className="font-medium">{order.academicLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pages</p>
                    <p className="font-medium">{order.pages}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Word Count</p>
                    <p className="font-medium">{order.wordCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-medium">{formatDate(order.deadline)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">{formatCurrency(Number(order.price))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(Number(order.total_price))}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="whitespace-pre-line">{order.description}</p>
              </div>
              
              {order.uploadedfileslink && (
         <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Attached Files</h2>
             <div className="p-4 bg-gray-50 rounded-md">
           <ul className="list-disc list-inside space-y-1">
        {(Array.isArray(order.uploadedfileslink)
          ? order.uploadedfileslink
          : JSON.parse(order.uploadedfileslink) 
        ).map((file: string, index: number) => {
          const fileUrl = file.trim();
          return (
            <li key={index}>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                File link {index + 1}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
)}

              
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-2">Order Timeline</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <span>1</span>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  {order.orderStatus !== 'pending' && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <span>2</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">
                          Order {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.updatedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer Information and Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <Badge variant={order.isPaid ? 'default' : 'destructive'}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              {order.orderStatus === 'pending' && (
                <>
                  <Link href={`/dashboard/orders/${order.id}/accept`}>
                    <Button className="w-full" variant="default">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Order
                    </Button>
                  </Link>
                  <Link href={`/dashboard/orders/${order.id}/reject`}>
                    <Button className="w-full" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Order
                    </Button>
                  </Link>
                </>
              )}
              {order.orderStatus === 'accepted' && !order.freelancerId && (
                <Link href={`/dashboard/orders/${order.id}/assign`}>
                  <Button className="w-full" variant="default">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign to Freelancer
                  </Button>
                </Link>
              )}
              <Link href={`/dashboard/orders/${order.id}/contact`}>
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
              </Link>
            </div>
          </div>
          
          {order.freelancerId && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Assigned Freelancer</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{order.freelancer?.firstName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.freelancer?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 