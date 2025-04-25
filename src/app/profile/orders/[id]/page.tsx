import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, CloudCog, Download, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import db from '@/src/db';
import { formatCurrency } from '@/lib/utils';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  // Ensure user id exists
  const userId = session.user.id;
  if (!userId) {
    redirect('/login');
  }
  
  // Fetch the order for this user
  const order = await db.query.orders.findFirst({
    where: (order, { eq, and }) => and(
      eq(order.id, params.id),
      eq(order.userId, userId)
    ),
    with: {
      freelancer: true
    }
  });
  
  if (!order) {
    redirect('/profile/orders');
  }
  
  // Check if this order has already been reviewed
  const existingReview = await db.query.review.findFirst({
    where: (review, { eq }) => eq(review.orderId, params.id)
  });
  
  const hasReview = !!existingReview;
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy HH:mm');
  };
  
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
  console.log('files links shared',order.completedFileUrls)
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/profile">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
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
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">{formatCurrency(Number(order.price))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">{formatCurrency(Number(order.total_price))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-medium">{formatDate(order.deadline)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="whitespace-pre-line">{order.description}</p>
              </div>
             
              {order.uploadedfileslink && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-2">Your Files</h2>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <ul className="list-disc list-inside space-y-1">
                      {order.uploadedfileslink.split(',').map((file, index) => (
                        <li key={index}>
                          <a
                            href={file.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            File {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {order.completedFileUrls && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-2">Completed Work</h2>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <ul className="list-disc list-inside space-y-1">
                      {(() => {
                        try {
                          // Handle both comma-separated strings and direct URLs
                          const fileUrls = order.completedFileUrls.includes(',') 
                            ? order.completedFileUrls.split(',').map(url => url.trim())
                            : [order.completedFileUrls];
                            
                          return fileUrls.map((file, index) => (
                            <li key={index}>
                              <a
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Download File {index + 1}
                              </a>
                            </li>
                          ));
                        } catch (error) {
                          console.error('Error parsing file URLs:', error);
                          return <li className="text-red-500">Error loading files</li>;
                        }
                      })()}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment Information and Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{order.isPaid ? 'Paid' : 'Unpaid'}</p>
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
              )}
              {order.paymentDate && (
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(order.paymentDate)}</p>
                </div>
              )}
            </div>
          </div>
          
          {order.freelancer && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Assigned Freelancer</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{`${order.freelancer.firstName} ${order.freelancer.lastName}`}</p>
                </div>
                {order.freelancer.rating && (
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 mr-2">Rating:</p>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{Number(order.freelancer.rating).toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              {order.completedFileUrls && (
                <Button className="w-full" variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Files
                </Button>
              )}
              
              {order.orderStatus === 'completed' && order.freelancerId && !hasReview && (
                <Link href={`/profile/orders/${order.id}/review`}>
                  <Button className="w-full" variant="outline">
                    <StarIcon className="h-4 w-4 mr-2" />
                    Leave Review
                  </Button>
                </Link>
              )}
              
              {hasReview && (
                <div className="text-center text-sm text-gray-500 mt-2">
                  You have already reviewed this order
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 