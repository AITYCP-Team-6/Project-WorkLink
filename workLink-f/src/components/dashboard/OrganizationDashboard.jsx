import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, CreditCard, FileText, LogOut, Plus, Clock, 
  CheckCircle, MapPin, IndianRupee, Tag 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './OrganizationDashboard.css';

const OrganizationDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalStaff: 0,
    volunteersAssigned: 0,
    pendingPayments: 0,
    totalBudget: 0
  });

  const [events, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, staffRes, paymentsRes] = await Promise.all([
        api.get('/events'),
        api.get('/staff'),
        api.get('/payments')
      ]);

      const eventsData = eventsRes.data.data || [];
      const staffData = staffRes.data.data || [];
      const paymentsData = paymentsRes.data.data || paymentsRes.data || [];

      const volunteersAssigned = eventsData.reduce((count, event) => {
        return count + (event.allocatedStaff?.length || 0);
      }, 0);

      const pendingAmount = paymentsData
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalEvents: eventsData.length,
        activeEvents: eventsData.filter(e => e.status === 'ONGOING' || e.status === 'UPCOMING').length,
        totalStaff: staffData.length,
        volunteersAssigned,
        pendingPayments: pendingAmount,
        totalBudget: eventsData.reduce((sum, e) => sum + (e.budget || 0), 0)
      });

      setEvents(eventsData);
      setStaff(staffData);
      setPayments(paymentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/job-applications/organization")
      .then(res => {
        setApplications(res.data);
      })
      .catch(err => {
        console.error("Error fetching applications:", err);
      });
  }, []);

  const handleApprove = (id) => {
    api.put(`/job-applications/${id}/approve`)
      .then(() => {
        setApplications(prev =>
          prev.map(app =>
            app.jobApplicationId === id ? { ...app, approvalStatus: "APPROVED" } : app
          )
        );
        alert("Application approved successfully!");
      })
      .catch(err => {
        console.error("Error approving application:", err);
        alert("Failed to approve application");
      });
  };

  const handleReject = (id) => {
    api.put(`/job-applications/${id}/reject`)
      .then(() => {
        setApplications(prev =>
          prev.map(app =>
            app.jobApplicationId === id ? { ...app, approvalStatus: "REJECTED" } : app
          )
        );
        alert("Application rejected successfully!");
      })
      .catch(err => {
        console.error("Error rejecting application:", err);
        alert("Failed to reject application");
      });
  };

  const handlePayment = async (payment) => {
    try {
      if (payment.event?.status !== 'COMPLETED') {
        alert("Payment can only be processed for completed events!");
        return;
      }

      const orderRes = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payment.amount }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderRes.json();

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "WorkLink",
        description: `Payment for ${payment.event?.title || 'Event'} to ${payment.user?.name || 'Volunteer'}`,
        order_id: order.orderId,

        handler: async (response) => {
          try {
            const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                volunteerId: payment.user?.id,
                taskId: payment.id,
                amount: payment.amount,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            const verifyData = await verifyRes.json();
            console.log("Payment verified:", verifyData);

            await api.put(`/payments/${payment.id}/mark-paid`, {
              transactionId: response.razorpay_payment_id,
              paymentDate: new Date().toISOString(),
              status: 'COMPLETED'
            });

            setPayments(prev =>
              prev.map(p =>
                p.id === payment.id ? { ...p, status: 'COMPLETED', transactionId: response.razorpay_payment_id } : p
              )
            );

            setStats(prev => ({
              ...prev,
              pendingPayments: prev.pendingPayments - payment.amount
            }));

            alert("✅ Payment successful!");
            fetchDashboardData();
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("❌ Payment verification failed. Please contact support.");
          }
        },

        prefill: {
          name: payment.user?.name || '',
          email: payment.user?.email || '',
          contact: payment.user?.phone || ''
        },

        theme: { 
          color: "#4f46e5" 
        },

        modal: {
          ondismiss: () => {
            console.log("Payment cancelled by user");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const requestApproval = async (eventId) => {
    try {
      await api.put(`/events/${eventId}/request-approval`);
      alert('Approval request sent to admin!');
      fetchDashboardData();
    } catch (error) {
      alert('Error requesting approval');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      EXAM: '🎓',
      WORKSHOP: '🛠️',
      COMMUNITY: '🤝',
      SPORTS: '⚽',
      CHARITY: '❤️',
      OTHER: '📌'
    };
    return icons[category] || '📌';
  };

  const calculateProgress = (allocated, required) => {
    return Math.min((allocated / required) * 100, 100);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
        <p className="text-purple-100">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Events</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Volunteers Assigned</p>
              <p className="text-3xl font-bold text-gray-800">{stats.volunteersAssigned}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-600">₹{stats.pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Staff</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalStaff}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* My Events Section with Detailed Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
          <Link to="/events/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events created yet</h3>
            <p className="text-gray-500 mb-4">Create your first event to get started</p>
            <Link to="/events/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Link 
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 overflow-hidden"
              >
                {/* Event Header */}
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {getCategoryIcon(event.category)}
                    {event.category}
                  </span>
                </div>

                {/* Event Body */}
                <div className="p-5 space-y-3">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">LOCATION</div>
                      <div className="text-sm font-medium text-gray-800 truncate">{event.location}</div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">DATE RANGE</div>
                      <div className="text-sm font-medium text-gray-800">
                        {new Date(event.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} - {new Date(event.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IndianRupee size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">BUDGET</div>
                      <div className="text-sm font-bold text-green-600">₹{event.budget?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>

                  {/* Approval Status Button */}
                  <div className="pt-2">
                    {event.status === 'CREATED' && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          requestApproval(event.id);
                        }} 
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Request Approval
                      </button>
                    )}
                    {event.approvalStatus === "PENDING" && (
                      <button className="w-full bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium" disabled>
                        Approval Pending
                      </button>
                    )}
                    {event.approvalStatus === "APPROVED" && (
                      <button className="w-full bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium" disabled>
                        ✓ Approved
                      </button>
                    )}
                    {event.approvalStatus === "REJECTED" && (
                      <button className="w-full bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium" disabled>
                        ✗ Rejected
                      </button>
                    )}
                  </div>
                </div>

                {/* Event Footer */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'POSTED' ? 'bg-purple-100 text-purple-800' :
                    event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'ONGOING' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span className="font-medium">{event.allocatedStaff?.length || 0}/{event.requiredStaff}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden ml-1">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${calculateProgress(
                            event.allocatedStaff?.length || 0, 
                            event.requiredStaff
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/events/new" className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <span className="font-semibold text-gray-700">Create Event</span>
        </Link>

        <Link to="/attendance" className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Clock className="text-green-600" size={24} />
          </div>
          <span className="font-semibold text-gray-700">Mark Attendance</span>
        </Link>

        <button 
          onClick={() => setActiveTab('payments')}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <CreditCard className="text-purple-600" size={24} />
          </div>
          <span className="font-semibold text-gray-700">Process Payments</span>
        </button>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Volunteer Applications</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Applications</h2>
        {applications.filter(app => app.approvalStatus === "PENDING").length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500">No pending applications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.filter(app => app.approvalStatus === 'PENDING').map(app => (
              <div key={app.jobApplicationId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">{app.volunteer?.name || 'Unknown Volunteer'}</h3>
                  <p className="text-sm text-gray-600">Applied for: {app.event?.title || 'Unknown Event'}</p>
                  <p className="text-xs text-gray-500 mt-1">Applied on: {new Date(app.appliedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(app.jobApplicationId)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button onClick={() => handleReject(app.jobApplicationId)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Processed Applications</h2>
          {applications.filter(app => app.approvalStatus !== "PENDING").length === 0 ? (
            <p className="text-gray-500 text-center py-4">No processed applications yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.filter(app => app.approvalStatus !== 'PENDING').map(app => (
                <div key={app.jobApplicationId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-800">{app.volunteer?.name || 'Unknown Volunteer'}</h3>
                    <p className="text-sm text-gray-600">Applied for: {app.event?.title || 'Unknown Event'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {app.approvalStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Volunteer Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-2">Total Payable</div>
          <div className="text-3xl font-bold text-gray-800">
            ₹{payments.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600 mb-2">Pending Payments</div>
          <div className="text-3xl font-bold text-yellow-600">₹{stats.pendingPayments}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-2">Paid Amount</div>
          <div className="text-3xl font-bold text-gray-800">
            ₹{payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Volunteer Payouts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Volunteer</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Event</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Event Status</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Hours</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Amount (₹)</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Payment Status</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No payments to process</p>
                  </td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{payment.user?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{payment.event?.title || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.event?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        payment.event?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {payment.event?.status || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{payment.hoursWorked || 0}</td>
                    <td className="py-3 px-4 font-semibold">₹{payment.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {payment.status === 'PENDING' ? (
                        payment.event?.status === 'COMPLETED' ? (
                          <button 
                            onClick={() => handlePayment(payment)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Pay Now
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Event not completed
                          </span>
                        )
                      ) : (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={16} />
                          Paid
                        </span>
                      )}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-3">ORGANIZER Report</h2>
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
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 org-dashboard-container">
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">WorkLink</h1>
        </div>

        <nav className="flex-1 p-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <Calendar size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <Link to="/events/new" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-gray-300 hover:bg-gray-700">
            <Plus size={20} />
            <span className="font-medium">Create Event</span>
          </Link>

          <Link to="/events" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-gray-300 hover:bg-gray-700">
            <Calendar size={20} />
            <span className="font-medium">View Events</span>
          </Link>

          <button onClick={() => setActiveTab('applications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${activeTab === 'applications' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <Users size={20} />
            <span className="font-medium">Applications</span>
          </button>

          <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <CreditCard size={20} />
            <span className="font-medium">Payments</span>
          </button>

          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <FileText size={20} />
            <span className="font-medium">Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Logged in as</span>
            <span className="font-semibold text-gray-800">{user?.name || 'Organizer'}</span>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'O'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="tab-content-animate">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'applications' && renderApplications()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'reports' && renderReports()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationDashboard;