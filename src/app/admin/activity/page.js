'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, MousePointer, Clock, 
  Calendar, BarChart4, Filter, RefreshCw 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function UserActivityDashboard() {
  const [activities, setActivities] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pageViews: 0,
    searches: 0,
    reservations: 0
  });
  
  // Fetch activities on load and periodically
  useEffect(() => {
    // Initial fetch
    fetchActivities();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchActivities, 10000);
    
    return () => clearInterval(interval);
  }, [filter, timeRange]);
  
  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd make API calls to your backend
      const response = await fetch(`/api/admin/user-activity?filter=\${filter}&timeRange=\${timeRange}`);
      const data = await response.json();
      
      setActivities(data.activities);
      setActiveUsers(data.activeUsers);
      setStats(data.stats);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching activity data:", error);
      setIsLoading(false);
    }
  };
  
  // Dummy chart data (replace with real data)
  const activityChartData = [
    { time: '00:00', pageViews: 13, searches: 5, reservations: 2 },
    { time: '03:00', pageViews: 8, searches: 3, reservations: 1 },
    { time: '06:00', pageViews: 15, searches: 7, reservations: 0 },
    { time: '09:00', pageViews: 47, searches: 22, reservations: 9 },
    { time: '12:00', pageViews: 65, searches: 30, reservations: 12 },
    { time: '15:00', pageViews: 52, searches: 25, reservations: 10 },
    { time: '18:00', pageViews: 73, searches: 35, reservations: 15 },
    { time: '21:00', pageViews: 45, searches: 21, reservations: 8 },
  ];
  
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Activity Dashboard</h1>
        
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Activities</option>
              <option value="pageViews">Page Views</option>
              <option value="searches">Searches</option>
              <option value="reservations">Reservations</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          <button 
            onClick={fetchActivities}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-4 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-md">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Active Users</p>
                <h3 className="font-bold text-2xl text-gray-800">
                  {isLoading ? '...' : activeUsers}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-md">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Page Views</p>
                <h3 className="font-bold text-2xl text-gray-800">
                  {isLoading ? '...' : stats.pageViews}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-md">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Searches</p>
                <h3 className="font-bold text-2xl text-gray-800">
                  {isLoading ? '...' : stats.searches}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-md">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Reservations</p>
                <h3 className="font-bold text-2xl text-gray-800">
                  {isLoading ? '...' : stats.reservations}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-md border border-indigo-100">
          <h2 className="text-lg font-semibold mb-5 flex items-center">
            <BarChart4 className="mr-2 h-5 w-5 text-indigo-600" />
            Activity Over Time
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="pageViews" stroke="#818CF8" fill="#EEF2FF" strokeWidth={2} />
                <Area type="monotone" dataKey="searches" stroke="#60A5FA" fill="#DBEAFE" strokeWidth={2} />
                <Area type="monotone" dataKey="reservations" stroke="#34D399" fill="#ECFDF5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-md border border-indigo-100">
          <h2 className="text-lg font-semibold mb-5">Real-time Activity Feed</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-72">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="h-72 overflow-y-auto pr-2 space-y-3">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-l-4 border-indigo-500 pl-3 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-500">
                          User: {activity.user?.name || activity.userId}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {activity.details && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {JSON.stringify(activity.details)}
                      </p>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-10">No recent activities found</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* User Sessions Table */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-indigo-100">
        <h2 className="text-lg font-semibold mb-5">Active User Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Start</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* You would map through actual session data here */}
              {[1, 2, 3, 4].map(i => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img className="h-8 w-8 rounded-full" src={`https://i.pravatar.cc/150?img=\${i}`} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">User {i}</div>
                        <div className="text-sm text-gray-500">user{i}@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(Math.random() * 60)} minutes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    192.168.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                    Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}