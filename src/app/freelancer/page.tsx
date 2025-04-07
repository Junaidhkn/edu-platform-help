import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, FileText, Star } from 'lucide-react';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export const metadata = {
  title: 'Freelancer Dashboard',
  description: 'Manage your assigned orders and view your profile.',
};

export default async function FreelancerDashboardPage() {
  const session = await auth();
  
  if (!session?.user || !(session.user as any).isFreelancer) {
    redirect('/auth/signin');
  }
  
  // Ensure user.id exists before querying
  if (!session.user.id) {
    redirect('/auth/signin');
  }
  
  // Fetch freelancer's orders
  const freelancerOrders = await db.select()
    .from(orders)
    .where(eq(orders.freelancerId, session.user.id));
  
  // Count orders by status
  const completedOrders = freelancerOrders.filter(order => order.orderStatus === 'completed').length;
  const activeOrders = freelancerOrders.filter(order => order.orderStatus === 'accepted').length;
  const totalOrders = freelancerOrders.length;
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All orders assigned to you
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders currently in progress
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed orders
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>
                View and manage your assigned orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/freelancer/orders">
                <Button className="w-full">View All Orders</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your freelancer profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/freelancer/profile">
                <Button variant="outline" className="w-full">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 