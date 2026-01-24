import { Routes, Route } from "react-router-dom";

/* AUTH */
import Login from "./auth/Login";
import Register from "./auth/Register";

/* ADMIN */
import AdminDashboard from "./dashboards/admin/AdminDashboard";
import ManageUsers from "./dashboards/admin/ManageUsers";
import AdminPayments from "./dashboards/admin/Payments";

/* ORGANIZER */
import OrganizerDashboard from "./dashboards/organizer/OrganizerDashboard";
import CreateEvent from "./dashboards/organizer/CreateEvent";
import OrganizerPayments from "./dashboards/organizer/Payments";

/* VOLUNTEER */
import VolunteerDashboard from "./dashboards/volunteer/VolunteerDashboard";
import MyTasks from "./dashboards/volunteer/MyTasks";
import MyApplications from "./dashboards/volunteer/MyApplications";
import VolunteerPayments from "./dashboards/volunteer/Payments";

/* COMMON */
import Reports from "./dashboards/common/Reports";
import OrganizerApplications from "./dashboards/organizer/OrganizerApplications";
import Home from "./Home";

function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/admin/reports" element={<Reports role="admin" />} />

      {/* ORGANIZER */}
      <Route path="/organizer" element={<OrganizerDashboard />} />
      <Route path="/organizer/create-event" element={<CreateEvent />} />
      <Route path="/organizer/payments" element={<OrganizerPayments />} />
      <Route path="/organizer/reports" element={<Reports role="organizer" />} />
      <Route
        path="/organizer/applications"
        element={<OrganizerApplications />}
      />

      {/* VOLUNTEER */}
      <Route path="/volunteer" element={<VolunteerDashboard />} />
      <Route path="/volunteer/jobs" element={<MyTasks />} />
      <Route path="/volunteer/applications" element={<MyApplications />} />
      <Route path="/volunteer/payments" element={<VolunteerPayments />} />
      <Route path="/volunteer/reports" element={<Reports role="volunteer" />} />
    </Routes>
  );
}

export default App;
