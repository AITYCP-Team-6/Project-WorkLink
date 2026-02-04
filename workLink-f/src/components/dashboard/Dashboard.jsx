// src/components/dashboard/Dashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import VolunteerDashboard from './VolunteerDashboard';
import OrganizationDashboard from './OrganizationDashboard';
import { AdminDashboard } from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Render dashboard based on role
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    
    case 'MANAGER':
      return <OrganizationDashboard />;
    
    case 'STAFF':
    default:
      return <VolunteerDashboard />;
  }
};

export default Dashboard;