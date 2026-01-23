import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./Payments.css";

const OrganizerPayments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      volunteer: "John Doe",
      event: "City Tech Summit",
      hours: 8,
      amount: 120,
      status: "pending",
    },
    {
      id: 2,
      volunteer: "Alice Smith",
      event: "Community Marathon",
      hours: 10,
      amount: 150,
      status: "paid",
    },
  ]);

  const markPaid = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p)),
    );
  };

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="app-layout">
      <Sidebar role="organizer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Organizer" title="Volunteer Payments" />

        {/* SUMMARY CARDS */}
        <div className="payment-cards">
          <div className="pay-card">
            <p>Total Payable</p>
            <h2>${totalPaid + totalPending}</h2>
          </div>

          <div className="pay-card pending">
            <p>Pending Payments</p>
            <h2>${totalPending}</h2>
          </div>

          <div className="pay-card success">
            <p>Paid Amount</p>
            <h2>${totalPaid}</h2>
          </div>
        </div>

        {/* PAYMENTS TABLE */}
        <div className="table-card organizer-payments">
          <h3>Volunteer Payouts</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Event</th>
                  <th>Hours</th>
                  <th>Amount ($)</th>
                  <th>Status</th>
                  <th className="actions-col">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.volunteer}</td>
                    <td>{p.event}</td>
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
                    <td className="actions">
                      {p.status === "pending" ? (
                        <button
                          className="btn pay"
                          onClick={() => markPaid(p.id)}
                        >
                          Pay
                        </button>
                      ) : (
                        <span className="done-text">✔ Paid</span>
                      )}
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

export default OrganizerPayments;
