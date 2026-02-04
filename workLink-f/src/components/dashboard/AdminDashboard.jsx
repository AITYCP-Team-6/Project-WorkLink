import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AdminEventApprovals from './AdminEventApproval';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Calendar, IndianRupee, Clock, CheckCircle, LogOut, TrendingUp, FileText, CreditCard, AlertCircle, RefreshCw, Filter, Search, Download, Edit, Trash2, Plus, X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// API Service
const api = {
  // Get auth token from localStorage
  getAuthToken: () => localStorage.getItem('token'),
  
  // Set auth header
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${api.getAuthToken()}`
  }),

  // Users
  getAllUsers: () => axios.get(`${API_BASE_URL}/staff`, { headers: api.getHeaders() }),
  updateUserStatus: (userId, status) => axios.put(`${API_BASE_URL}/staff/${userId}`, status, { headers: api.getHeaders() }),
  deleteUser: (userId) => axios.delete(`${API_BASE_URL}/staff/${userId}`, { headers: api.getHeaders() }),

  // Events
  getAllEvents: () => axios.get(`${API_BASE_URL}/events`, { headers: api.getHeaders() }),
  getEventsByStatus: (status) => axios.get(`${API_BASE_URL}/events/status/${status}`, { headers: api.getHeaders() }),
  createEvent: (eventData) => axios.post(`${API_BASE_URL}/events`, eventData, { headers: api.getHeaders() }),
  updateEvent: (eventId, eventData) => axios.put(`${API_BASE_URL}/events/${eventId}`, eventData, { headers: api.getHeaders() }),
  deleteEvent: (eventId) => axios.delete(`${API_BASE_URL}/events/${eventId}`, { headers: api.getHeaders() }),

  // Attendance
  getAllAttendance: () => axios.get(`${API_BASE_URL}/attendance`, { headers: api.getHeaders() }),
  getAttendanceByEvent: (eventId) => axios.get(`${API_BASE_URL}/attendance/event/${eventId}`, { headers: api.getHeaders() }),
  getAttendanceByStaff: (staffId) => axios.get(`${API_BASE_URL}/attendance/staff/${staffId}`, { headers: api.getHeaders() }),

  // Payments
  getAllPayments: () => axios.get(`${API_BASE_URL}/payments`, { headers: api.getHeaders() }),
  getPaymentsByStaff: (staffId) => axios.get(`${API_BASE_URL}/payments/staff/${staffId}`, { headers: api.getHeaders() }),
  getPaymentsByEvent: (eventId) => axios.get(`${API_BASE_URL}/payments/event/${eventId}`, { headers: api.getHeaders() }),
  updatePaymentStatus: (paymentId, status) => axios.put(`${API_BASE_URL}/payments/${paymentId}/status?status=${status}`, {}, { headers: api.getHeaders() }),
  processPayment: (paymentData) => axios.post(`${API_BASE_URL}/payments`, paymentData, { headers: api.getHeaders() }),

  // Job Postings
  getAllJobPostings: () => axios.get(`${API_BASE_URL}/jobs`, { headers: api.getHeaders() }),
  createJobPosting: (jobData) => axios.post(`${API_BASE_URL}/jobs`, jobData, { headers: api.getHeaders() }),
  
  // Job Applications
  getApplicationsByJob: (jobId) => axios.get(`${API_BASE_URL}/applications/job/${jobId}`, { headers: api.getHeaders() }),
  updateApplicationStatus: (appId, status) => axios.put(`${API_BASE_URL}/applications/${appId}/status?status=${status}`, {}, { headers: api.getHeaders() }),

  // Admin specific
  getDashboardStats: async () => {
    try {
      const [users, events, payments, attendance] = await Promise.all([
        api.getAllUsers(),
        api.getAllEvents(),
        api.getAllPayments(),
        api.getAllAttendance()
      ]);
      return { users: users.data, events: events.data, payments: payments.data, attendance: attendance.data };
    } catch (error) {
      throw error;
    }
  }
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State for data
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    pendingApprovals: 0,
    revenueProcessed: 0,
    totalEvents: 0,
    completedEvents: 0,
    activeStaff: 0,
    pendingPayments: 0
  });

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Filters
  const [userFilter, setUserFilter] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');

  // Chart data
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [eventStatusData, setEventStatusData] = useState([]);
  const [paymentTrendsData, setPaymentTrendsData] = useState([]);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      
      // Process users
      const usersData = data.users.data || [];
      setUsers(usersData);

      // Process events
      const eventsData = data.events.data || [];
      setEvents(eventsData);

      // Process payments
      const paymentsData = data.payments.data || [];
      setPayments(paymentsData);

      // Process attendance
      const attendanceData = data.attendance.data || [];
      setAttendance(attendanceData);

      // Calculate statistics
      const activeEvents = eventsData.filter(e => e.status === 'UPCOMING' || e.status === 'ONGOING').length;
      const completedEvents = eventsData.filter(e => e.status === 'COMPLETED').length;
      const pendingPayments = paymentsData.filter(p => p.status === 'PENDING').length;
      const pendingEventCount = eventsData.filter(e => e.approvalStatus === 'PENDING').length;
      const totalRevenue = paymentsData
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      setStats({
        totalUsers: usersData.length,
        activeEvents: activeEvents,
        pendingApprovals: usersData.filter(u => !u.availability).length,
        revenueProcessed: totalRevenue,
        pendingEventApprovals: pendingEventCount,
        totalEvents: eventsData.length,
        completedEvents: completedEvents,
        activeStaff: usersData.filter(u => u.availability && u.role === 'STAFF').length,
        pendingPayments: pendingPayments
      });

      // Generate chart data
      generateChartData(usersData, eventsData, paymentsData);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (usersData, eventsData, paymentsData) => {
    // User growth by month
    const usersByMonth = {};
    usersData.forEach(user => {
      if (user.createdAt) {
        const month = new Date(user.createdAt).toLocaleString('default', { month: 'short' });
        usersByMonth[month] = (usersByMonth[month] || 0) + 1;
      }
    });
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cumulative = 0;
    const growthData = months.map(month => {
      cumulative += usersByMonth[month] || 0;
      return { month, Users: cumulative };
    }).filter(d => d.Users > 0);
    setUserGrowthData(growthData);

    // Event status distribution
    const statusCounts = {
      UPCOMING: eventsData.filter(e => e.status === 'UPCOMING').length,
      ONGOING: eventsData.filter(e => e.status === 'ONGOING').length,
      COMPLETED: eventsData.filter(e => e.status === 'COMPLETED').length,
      CANCELLED: eventsData.filter(e => e.status === 'CANCELLED').length
    };
    
    const statusData = [
      { name: 'Upcoming', value: statusCounts.UPCOMING, color: '#3b82f6' },
      { name: 'Ongoing', value: statusCounts.ONGOING, color: '#10b981' },
      { name: 'Completed', value: statusCounts.COMPLETED, color: '#8b5cf6' },
      { name: 'Cancelled', value: statusCounts.CANCELLED, color: '#ef4444' }
    ].filter(d => d.value > 0);
    setEventStatusData(statusData);

    // Payment trends
    const paymentsByMonth = {};
    paymentsData.forEach(payment => {
      if (payment.createdAt) {
        const month = new Date(payment.createdAt).toLocaleString('default', { month: 'short' });
        paymentsByMonth[month] = (paymentsByMonth[month] || 0) + payment.amount;
      }
    });
    
    const paymentTrends = months.map(month => ({
      month,
      Amount: paymentsByMonth[month] || 0
    })).filter(d => d.Amount > 0);
    setPaymentTrendsData(paymentTrends);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleApproveUser = async (userId) => {
    try {
      setLoading(true);
      await api.updateUserStatus(userId, { availability: true });
      showSuccess('User approved successfully');
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve user');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;
    
    try {
      setLoading(true);
      await api.deleteUser(userId);
      showSuccess('User rejected successfully');
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      await api.deleteUser(userId);
      showSuccess('User deleted successfully');
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (paymentId) => {
    if (!window.confirm('Process this payment?')) return;
    
    try {
      setLoading(true);
      await api.updatePaymentStatus(paymentId, 'COMPLETED');
      showSuccess('Payment processed successfully');
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setLoading(true);
      await api.deleteEvent(eventId);
      showSuccess('Event deleted successfully');
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // Filtered data
  const filteredUsers = users.filter(user => {
    const searchMatch = !userFilter || 
      user.name?.toLowerCase().includes(userFilter.toLowerCase()) ||
      user.email?.toLowerCase().includes(userFilter.toLowerCase());
    return searchMatch;
  });

  const filteredEvents = events.filter(event => {
    return eventStatusFilter === 'ALL' || event.status === eventStatusFilter;
  });

  const filteredPayments = payments.filter(payment => {
    return paymentStatusFilter === 'ALL' || payment.status === paymentStatusFilter;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-indigo-100">System Overview & Analytics</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Active Staff: {stats.activeStaff}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Events</p>
              <p className="text-3xl font-bold text-gray-800">{stats.activeEvents}</p>
              <p className="text-xs text-gray-500 mt-1">Total: {stats.totalEvents}</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingPayments}</p>
              <p className="text-xs text-gray-500 mt-1">Requires action</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue Processed</p>
              <p className="text-3xl font-bold text-green-600">₹{(stats.revenueProcessed / 1000).toFixed(1)}k</p>
              <p className="text-xs text-gray-500 mt-1">Completed payments</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <IndianRupee className="text-green-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">User Growth Trend</h2>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Users" stroke="#667eea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Event Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Event Status Distribution</h2>
          {eventStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {eventStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No events data
            </div>
          )}
        </div>
      </div>

      {/* Payment Trends */}
      {paymentTrendsData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* System Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-600 mb-1 font-semibold">Active Staff</p>
            <p className="text-3xl font-bold text-blue-800">{stats.activeStaff}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-sm text-green-600 mb-1 font-semibold">Completed Events</p>
            <p className="text-3xl font-bold text-green-800">{stats.completedEvents}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-purple-600 mb-1 font-semibold">Success Rate</p>
            <p className="text-3xl font-bold text-purple-800">
              {stats.totalEvents > 0 ? ((stats.completedEvents / stats.totalEvents) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <p className="text-sm text-yellow-600 mb-1 font-semibold">Avg. Event Staff</p>
            <p className="text-3xl font-bold text-yellow-800">
              {stats.totalEvents > 0 ? Math.round(attendance.length / stats.totalEvents) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent User Registrations</h2>
          <div className="space-y-3">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.availability ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.availability ? 'Active' : 'Pending'}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-center text-gray-400 py-8">No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events.filter(e => e.status === 'UPCOMING').slice(0, 5).map(event => (
              <div key={event.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-800">{event.title}</p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                    {event.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {event.requiredStaff} staff needed
                  </span>
                </div>
              </div>
            ))}
            {events.filter(e => e.status === 'UPCOMING').length === 0 && (
              <p className="text-center text-gray-400 py-8">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('users')}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="text-blue-600" size={24} />
          </div>
          <span className="font-semibold text-gray-700">Manage Users</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="text-green-600" size={24} />
          </div>
          <span className="font-semibold text-gray-700">Manage Events</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard className="text-purple-600" size={24} />
          </div>
          <span className="font-semibold text-gray-700">Process Payments</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="text-indigo-600" size={24} />
          </div>
          <span className="font-semibold text-gray-700">View Reports</span>
        </button>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 font-bold text-gray-700">User</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Hourly Rate</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">₹{user.hourlyRate?.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.availability ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.availability ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      {!user.availability && (
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={48} className="mx-auto mb-2 opacity-20" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Active Staff</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.availability && u.role === 'STAFF').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Managers</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'MANAGER').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Admins</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'ADMIN').length}
          </p>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
        <div className="flex gap-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowEventModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create Event
          </button>
        </div>
      </div>

      {/* Event Status Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2">
          {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setEventStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                eventStatusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 ${
              event.status === 'UPCOMING' ? 'bg-blue-500' :
              event.status === 'ONGOING' ? 'bg-green-500' :
              event.status === 'COMPLETED' ? 'bg-purple-500' :
              'bg-red-500'
            }`}></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
                  event.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={16} />
                  <span>{event.requiredStaff} staff required</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <IndianRupee size={16} />
                  <span>Budget: ₹{event.budget?.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setShowEventModal(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Calendar size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">No events found</p>
          <p className="text-sm">Create your first event to get started</p>
        </div>
      )}

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Events</p>
          <p className="text-2xl font-bold text-gray-800">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">
            {events.filter(e => e.status === 'UPCOMING').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Ongoing</p>
          <p className="text-2xl font-bold text-green-600">
            {events.filter(e => e.status === 'ONGOING').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-purple-600">
            {events.filter(e => e.status === 'COMPLETED').length}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-2">Total Payments</div>
          <div className="text-3xl font-bold text-gray-800">${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-2">Completed</div>
          <div className="text-3xl font-bold text-green-800">
            ${payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600 mb-2">Pending</div>
          <div className="text-3xl font-bold text-yellow-800">
            ${payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 mb-2">Processing</div>
          <div className="text-3xl font-bold text-purple-800">
            ${payments.filter(p => p.status === 'PROCESSING').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Payment Status Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].map(status => (
            <button
              key={status}
              onClick={() => setPaymentStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                paymentStatusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 font-bold text-gray-700">Staff Member</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Event</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Hours</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Rate</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-800">{payment.staff?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{payment.staff?.email || ''}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{payment.event?.title || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">{payment.hoursWorked?.toFixed(1)}</td>
                  <td className="py-4 px-6 text-gray-600">${payment.hourlyRate?.toFixed(2)}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">${payment.amount?.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      payment.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {payment.status === 'PENDING' ? (
                      <button
                        onClick={() => handleProcessPayment(payment.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <IndianRupee size={14} />
                        Process
                      </button>
                    ) : payment.status === 'COMPLETED' ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle size={16} />
                        Paid
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CreditCard size={48} className="mx-auto mb-2 opacity-20" />
              <p>No payments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">System Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">User Report</h2>
              <p className="text-sm text-gray-600">Complete user activity report</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Generate a detailed PDF report containing all user registrations, roles, and activity summary.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Download size={20} />
            Download User Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Event Report</h2>
              <p className="text-sm text-gray-600">Event statistics and analytics</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Generate a comprehensive report of all events, staff allocation, and completion rates.
          </p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Download size={20} />
            Download Event Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Financial Report</h2>
              <p className="text-sm text-gray-600">Payment and revenue analytics</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Generate a detailed financial report including all payments, pending amounts, and revenue.
          </p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Download size={20} />
            Download Financial Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Analytics Report</h2>
              <p className="text-sm text-gray-600">Comprehensive system analytics</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Generate an analytics report with trends, growth metrics, and performance indicators.
          </p>
          <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Download size={20} />
            Download Analytics Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Current Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Users</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{events.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Events</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{payments.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Payments</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{attendance.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Attendance</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading && !users.length && !events.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">WorkLink Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <TrendingUp size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Users</span>
            {stats.pendingApprovals > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.pendingApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'events' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Calendar size={20} />
            <span className="font-medium">Events</span>
            {stats.activeEvents > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.activeEvents}
              </span>
            )}
          </button>

          <button
              onClick={() => setActiveTab('approvals')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'approvals' 
                  ? 'bg-orange-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
            <CheckCircle size={20} />
            <span className="font-medium">Approvals</span>
            {stats.pendingEventApprovals > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {stats.pendingEventApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'payments' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <CreditCard size={20} />
            <span className="font-medium">Payments</span>
            {stats.pendingPayments > 0 && (
              <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.pendingPayments}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'reports' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Logged in as</span>
              <span className="font-semibold text-gray-800">
                {JSON.parse(localStorage.getItem('user') || '{}').name || 'Admin'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw size={16} className="animate-spin" />
                <span>Loading...</span>
              </div>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {(JSON.parse(localStorage.getItem('user') || '{}').name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Messages */}
        {error && (
          <div className="mx-8 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button onClick={clearMessages} className="text-red-600 hover:text-red-800">
              <X size={20} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mx-8 mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-green-800 font-semibold">Success</p>
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
            <button onClick={clearMessages} className="text-green-600 hover:text-green-800">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'approvals' && (
            <AdminEventApprovals 
              onActionComplete={loadDashboardData} // Pass a callback to refresh stats after approval
            />
          )}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'reports' && renderReports()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;