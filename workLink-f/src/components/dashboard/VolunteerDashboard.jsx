import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Briefcase, CreditCard, FileText, LogOut, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    assignedEvents: 0,
    completedEvents: 0,
    upcomingEvents: 0,
    totalHours: 0,
    totalEarnings: 0,
    pendingPayments: 0,
    paidAmount: 0
  });
  
  const [myEvents, setMyEvents] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appliedEventIds, setAppliedEventIds] = useState(new Set());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, attendanceRes, paymentsRes] = await Promise.all([
        api.get('/events'),
        api.get(`/attendance?staff=${user.id}`),
        api.get(`/payments?staff=${user.id}`)
      ]);

      const allEvents = eventsRes.data.data || [];
      const myAssignedEvents = allEvents.filter(e => 
        e.allocatedStaff?.some(staff => staff.id === user.id)
      );
      
      const attendanceData = attendanceRes.data.data || [];
      const paymentData = paymentsRes.data.data || [];

      const totalEarnings = paymentData.reduce((sum, p) => sum + p.amount, 0);
      const paidAmount = paymentData.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = totalEarnings - paidAmount;

      setStats({
        assignedEvents: myAssignedEvents.length,
        completedEvents: myAssignedEvents.filter(e => e.status === 'COMPLETED').length,
        upcomingEvents: myAssignedEvents.filter(e => e.status === 'UPCOMING').length,
        totalHours: attendanceData.reduce((sum, a) => sum + (a.hoursWorked || 0), 0),
        totalEarnings,
        pendingPayments: pendingAmount,
        paidAmount
      });

      setMyEvents(myAssignedEvents);
      setRecentAttendance(attendanceData);
      setPayments(paymentData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // FIXED: Fetch posted events
  useEffect(() => {
    api.get('/events/posted')
      .then(res => {
        console.log("Posted events:", res.data.data);
        setEvents(res.data.data || []);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
      });
  }, []);

  // FIXED: Apply handler
  const handleApply = async (eventId) => {
    try {
      await api.post(`/job-applications/apply/${eventId}`);
      setAppliedEventIds(prev => new Set([...prev, eventId]));
      fetchApplications();
    } catch (err) {
      console.error("Error applying:", err);
      if (err.response?.status === 400) {
        alert(err.response.data.message || "You have already applied for this event.");
      } else {
        alert("Failed to apply. Please try again.");
      }
    }
  };

  // FIXED: Fetch volunteer's applications
  const fetchApplications = () => {
    api.get("/job-applications/volunteer")
      .then(res => {
        const data = res.data || [];
        setApplications(data);
        // Seed the set so already-applied buttons render correctly on load
        const ids = new Set(data.map(app => app.event?.id).filter(Boolean));
        setAppliedEventIds(ids);
      })
      .catch(err => {
        console.error("Error fetching applications:", err);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">Here's your work summary</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Assigned Events</p>
              <p className="text-3xl font-bold text-gray-800">{stats.assignedEvents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-800">{stats.completedEvents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-gray-800">{stats.upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-800">₹{stats.totalEarnings.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Available Jobs Section - FIXED */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Available Jobs</h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
            Browse All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500">No events available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map(event => (
              <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{event.title}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-blue-600">Budget: ₹{event.budget}</p>
                </div>

                {appliedEventIds.has(event.id) ? (
                  <div className="w-full mt-3 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg font-semibold">
                    <CheckCircle size={16} />
                    Applied
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(event.id)}
                    className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="text-blue-600" size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-800">{stats.totalHours.toFixed(1)}</h4>
              <p className="text-gray-600">Total Hours Worked</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-800">₹{user?.hourlyRate || 15}/hr</h4>
              <p className="text-gray-600">Your Hourly Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-yellow-600" size={28} />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-800">{payments.filter(p => p.status === 'PENDING').length}</h4>
              <p className="text-gray-600">Pending Payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyTasks = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Tasks</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Assigned Tasks</h2>
        
        {recentAttendance.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks assigned yet</h3>
            <p className="text-gray-500">Your assigned tasks will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Event</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Check-In</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Check-Out</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Hours</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map(record => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{record.event?.title || 'N/A'}</td>
                    <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{new Date(record.checkIn).toLocaleTimeString()}</td>
                    <td className="py-3 px-4">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                    <td className="py-3 px-4">{record.hoursWorked?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        record.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        record.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // FIXED: Applications rendering with correct field names
  const renderApplications = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Applied Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Event</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Organizer</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No applications yet</p>
                  </td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.jobApplicationId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{app.event?.title || 'N/A'}</td>
                    <td className="py-3 px-4">{app.event?.createdBy?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{app.event?.location || 'N/A'}</td>
                    <td className="py-3 px-4">{app.event?.startDate ? new Date(app.event.startDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        app.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        app.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        app.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.approvalStatus || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Earnings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-2">Total Earnings</div>
          <div className="text-3xl font-bold text-gray-800">₹{stats.totalEarnings.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-2">Paid Amount</div>
          <div className="text-3xl font-bold text-gray-800">₹{stats.paidAmount.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600 mb-2">Pending Amount</div>
          <div className="text-3xl font-bold text-gray-800">₹{stats.pendingPayments.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Event</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Transaction ID</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Hours</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Amount (₹)</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No payment history yet</p>
                  </td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{payment.event?.title || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{payment.transactionId}</td>
                    <td className="py-3 px-4">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{payment.hoursWorked?.toFixed(2)}</td>
                    <td className="py-3 px-4 font-semibold">{payment.amount?.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        payment.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">VOLUNTEER Report</h2>
        <p className="text-gray-600 mb-6">
          Generate and download a detailed PDF report containing your activity and summary data.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
          <FileText size={20} />
          Generate PDF
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">WorkLink</h1>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Calendar size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'tasks' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Briefcase size={20} />
            <span className="font-medium">My Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'applications' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">My Applications</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'payments' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <CreditCard size={20} />
            <span className="font-medium">Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'reports' 
                ? 'bg-blue-600 text-white' 
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
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Logged in as</span>
            <span className="font-semibold text-gray-800">{user?.name || 'Volunteer'}</span>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'V'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'tasks' && renderMyTasks()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'reports' && renderReports()}
        </main>
      </div>
    </div>
  );
};

export default VolunteerDashboard;