import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/NavBar';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navigation /> {/* Shows on all pages */}
      
      {/* Main Container handles margins and padding */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPanel /></ProtectedRoute>} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;