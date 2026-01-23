import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./Payments.css";

const Payments = () => {
  const payments = [
    {
      id: 1,
      event: "City Tech Summit 2025",
      organizer: "TechFlow Events",
      hours: 8,
      amount: 120,
      status: "pending",
      date: "15 Mar 2025",
    },
    {
      id: 2,
      event: "Community Marathon",
      organizer: "City Sports Dept",
      hours: 10,
      amount: 150,
      status: "paid",
      date: "10 Feb 2025",
    },
    {
      id: 3,
      event: "Job Fair 2025",
      organizer: "Job Expo Org",
      hours: 12,
      amount: 180,
      status: "paid",
      date: "05 Jan 2025",
    },
  ];

  const totalEarned = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalEarned - paidAmount;

  return (
    <div className="app-layout">
      <Sidebar role="volunteer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Volunteer" title="My Earnings" />

        {/* SUMMARY CARDS */}
        <div className="payment-cards">
          <div className="pay-card">
            <p>Total Earnings</p>
            <h2>${totalEarned}</h2>
          </div>

          <div className="pay-card success">
            <p>Paid Amount</p>
            <h2>${paidAmount}</h2>
          </div>

          <div className="pay-card pending">
            <p>Pending Amount</p>
            <h2>${pendingAmount}</h2>
          </div>
        </div>

        {/* PAYMENTS TABLE */}
        <div className="table-card volunteer-payments">
          <h3>Payment History</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Organizer</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Amount ($)</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.event}</td>
                    <td>{p.organizer}</td>
                    <td>{p.date}</td>
                    <td>{p.hours}</td>
                    <td>{p.amount}</td>
                    <td>
                      <span
                        className={`status ${
                          p.status === "paid" ? "paid" : "pending"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
