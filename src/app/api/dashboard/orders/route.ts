import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { orders, users } from '@/src/db/schema';
import { SQL, asc, count, desc, eq, sql } from 'drizzle-orm';
import { USER_ROLES } from '@/lib/constants';

const ITEMS_PER_PAGE = 7;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Extract query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const filter = url.searchParams.get('filter') || 'recent';

    // Calculate offset
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    // Count total orders based on filter
    let totalCount = 0;
    if (filter === 'pending') {
      const result = await db.select({ value: sql`count(*)` })
        .from(orders)
        .where(eq(orders.orderStatus, 'pending'));
      totalCount = Number(result[0]?.value || 0);
    } else if (filter === 'accepted') {
      const result = await db.select({ value: sql`count(*)` })
        .from(orders)
        .where(eq(orders.orderStatus, 'accepted'));
      totalCount = Number(result[0]?.value || 0);
    } else {
      const result = await db.select({ value: sql`count(*)` }).from(orders);
      totalCount = Number(result[0]?.value || 0);
    }
    
    // Fetch orders with pagination
    let ordersResult;
    if (filter === 'recent') {
      ordersResult = await db.select().from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    } else if (filter === 'deadline') {
      ordersResult = await db.select().from(orders)
        .orderBy(asc(orders.deadline))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    } else if (filter === 'pending') {
      ordersResult = await db.select().from(orders)
        .where(eq(orders.orderStatus, 'pending'))
        .orderBy(desc(orders.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    } else if (filter === 'accepted') {
      ordersResult = await db.select().from(orders)
        .where(eq(orders.orderStatus, 'accepted'))
        .orderBy(desc(orders.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    } else {
      ordersResult = await db.select().from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
    }
    
    // Get user IDs from orders
    const userIds = ordersResult.map(order => order.userId);
    
    // Fetch users in a single query
    const usersResult = userIds.length > 0 
      ? await db.query.users.findMany({
          where: (user: any, { inArray }: any) => inArray(user.id, userIds),
          columns: {
            id: true,
            name: true,
            email: true
          }
        })
      : [];
    
    // Create a map of users by ID for quick lookup
    const userMap = new Map();
    for (const user of usersResult) {
      userMap.set(user.id, user);
    }
    
    // Format orders with user data
    const formattedOrders = ordersResult.map(order => {
      const userData = userMap.get(order.userId) || null;
      return {
        ...order,
        user: userData
      };
    });
    
    return NextResponse.json({ 
      orders: formattedOrders, 
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE)
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 