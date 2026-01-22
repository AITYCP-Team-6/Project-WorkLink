/*ProtectedRoute is used to secure routes by checking authentication and role-based authorization before rendering components.*/

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has permission
  // “Is this route restricted to specific roles?”
  // “Is the logged-in user’s role NOT present in allowedRoles?”
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;