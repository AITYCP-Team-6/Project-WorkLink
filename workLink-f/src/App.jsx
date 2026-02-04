import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

/* ===== PUBLIC PAGES ===== */
import Home from "./components/welcome/Home";
import Features from "./components/welcome/pages/Features";
import About from "./components/welcome/pages/About";
import Contact from "./components/welcome/pages/Contact";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

/* ===== DASHBOARD ===== */
import Dashboard from "./components/dashboard/Dashboard";

/* ===== EVENTS ===== */
import EventList from "./components/events/EventList";
import EventForm from "./components/events/EventForm";
import EventDetail from "./components/events/EventDetail";

/* ===== STAFF ===== */
import StaffList from "./components/staff/StaffList";

/* ===== ATTENDANCE ===== */
import AttendanceTracker from "./components/attendance/AttendanceTracker";

/* ===== PAYMENTS ===== */
import PaymentProcessor from "./components/payments/PaymentProcessor";

import "./App.css";

/* =======================
   ROUTE GUARDS
======================= */

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const ManagerRoute = ({ children }) => {
  const { isManager, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  return isManager ? children : <Navigate to="/dashboard" />;
};

/* =======================
   ROUTES
======================= */

function AppContent() {
  return (
    <div className="App">
      <div className="main-content">
        <Routes>
          {/* ===== PUBLIC ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== PROTECTED ===== */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/events"
            element={
              <PrivateRoute>
                <EventList />
              </PrivateRoute>
            }
          />

          <Route
            path="/events/new"
            element={
              <ManagerRoute>
                <EventForm />
              </ManagerRoute>
            }
          />

          <Route
            path="/events/edit/:id"
            element={
              <ManagerRoute>
                <EventForm />
              </ManagerRoute>
            }
          />

          <Route
            path="/events/:id"
            element={
              <PrivateRoute>
                <EventDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <PrivateRoute>
                <StaffList />
              </PrivateRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <AttendanceTracker />
              </PrivateRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <PaymentProcessor />
              </PrivateRoute>
            }
          />

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

/* =======================
   APP ROOT
======================= */

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}