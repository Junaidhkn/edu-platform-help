import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Order Details | Freelancer Dashboard',
  description: 'View details of your assigned order',
};

export default async function FreelancerOrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  // Need to ensure user id exists
  const userId = session.user.id;
  if (!userId) {
    redirect('/login');
  }
  
  // Fetch the order, but only if it's assigned to this freelancer
  const order = await db.query.orders.findFirst({
    where: (order, { eq, and }) => and(
      eq(order.id, params.id),
      eq(order.freelancerId, userId)
    ),
    with: {
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  });
  
  if (!order) {
    redirect('/freelancer/orders');
  }
  
  // Function to determine badge color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy HH:mm');
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/freelancer/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to My Orders
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
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="whitespace-pre-line">{order.description}</p>
              </div>
              
              {order.uploadedfileslink && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold mb-2">Customer Files</h2>
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
                  <h2 className="text-lg font-semibold mb-2">Your Submitted Work</h2>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <ul className="list-disc list-inside space-y-1">
                      {order.completedFileUrls.split(',').map((file, index) => (
                        <li key={index}>
                          <a
                            href={file.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Submitted File {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
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
                <p className="font-medium">{order.user?.name || 'Anonymous'}</p>
              </div>
              {/* Note: In a real application, you might want to decide whether freelancers
                  should have access to customer emails or not */}
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.user?.email || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              {order.orderStatus === 'accepted' && (
                <Link href={`/freelancer/orders/${order.id}/submit`}>
                  <Button className="w-full" variant="default">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Completed Work
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 