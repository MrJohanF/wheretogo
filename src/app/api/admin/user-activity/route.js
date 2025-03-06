// app/api/admin/user-activity/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const timeRange = searchParams.get('timeRange') || '24h';
  
  // Calculate the date range based on timeRange
  const now = new Date();
  let dateFrom = new Date();
  
  switch (timeRange) {
    case '1h':
      dateFrom.setHours(now.getHours() - 1);
      break;
    case '6h':
      dateFrom.setHours(now.getHours() - 6);
      break;
    case '24h':
      dateFrom.setDate(now.getDate() - 1);
      break;
    case '7d':
      dateFrom.setDate(now.getDate() - 7);
      break;
    case '30d':
      dateFrom.setDate(now.getDate() - 30);
      break;
  }
  
  try {
    // Get user activities based on filter and time range
    let activities = [];
    
    if (filter === 'all' || filter === 'searches') {
      const searches = await prisma.searchHistory.findMany({
        where: {
          timestamp: {
            gte: dateFrom,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 50,
      });
      
      activities = [...activities, ...searches.map(search => ({
        id: `search_\${search.id}`,
        userId: search.userId,
        user: search.user,
        action: 'Search',
        details: { query: search.query },
        timestamp: search.timestamp,
      }))];
    }
    
    if (filter === 'all' || filter === 'pageViews') {
      const pageViews = await prisma.pageView.findMany({
        where: {
          timestamp: {
            gte: dateFrom,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 50,
      });
      
      activities = [...activities, ...pageViews.map(view => ({
        id: `pageview_\${view.id}`,
        userId: view.userId,
        user: view.user,
        action: 'Page View',
        details: { path: view.path, duration: view.duration },
        timestamp: view.timestamp,
      }))];
    }
    
    if (filter === 'all' || filter === 'reservations') {
      const reservations = await prisma.reservation.findMany({
        where: {
          createdAt: {
            gte: dateFrom,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
          place: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 30,
      });
      
      activities = [...activities, ...reservations.map(res => ({
        id: `reservation_\${res.id}`,
        userId: res.userId,
        user: res.user,
        action: 'Reservation',
        details: { 
          place: res.place.name,
          date: res.date,
          guests: res.guests,
          status: res.status
        },
        timestamp: res.createdAt,
      }))];
    }
    
    if (filter === 'all' || filter === 'favorites') {
      const favorites = await prisma.favorite.findMany({
        where: {
          createdAt: {
            gte: dateFrom,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
          place: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 30,
      });
      
      activities = [...activities, ...favorites.map(fav => ({
        id: `favorite_\${fav.userId}_\${fav.placeId}`,
        userId: fav.userId,
        user: fav.user,
        action: 'Added Favorite',
        details: { place: fav.place.name },
        timestamp: fav.createdAt,
      }))];
    }
    
    // Sort all activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Get active users count (users with an active session)
    const activeUsers = await prisma.userSession.count({
      where: {
        startTime: {
          gte: dateFrom,
        },
        endTime: null, // Session not ended
      },
    });
    
    // Get stats
    const pageViews = await prisma.pageView.count({
      where: {
        timestamp: {
          gte: dateFrom,
        },
      },
    });
    
    const searches = await prisma.searchHistory.count({
      where: {
        timestamp: {
          gte: dateFrom,
        },
      },
    });
    
    const reservations = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: dateFrom,
        },
      },
    });
    
    return NextResponse.json({
      activities,
      activeUsers,
      stats: {
        pageViews,
        searches,
        reservations
      }
    });
    
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 }
    );
  }
}