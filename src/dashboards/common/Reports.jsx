import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./Reports.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = ({ role }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // TITLE
    doc.setFontSize(18);
    doc.text(`WorkLink – ${role.toUpperCase()} Report`, 14, 20);

    // DATE
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    doc.setFontSize(13);
    doc.text("Summary", 14, 45);

    let tableHead = [];
    let tableBody = [];

    /* ROLE-BASED DATA */
    if (role === "admin") {
      doc.text("Total Users: 1240", 14, 55);
      doc.text("Active Events: 3", 14, 62);
      doc.text("Pending Approvals: 5", 14, 69);
      doc.text("Total Revenue: $45,000", 14, 76);

      tableHead = ["Volunteer", "Event", "Hours", "Amount", "Status"];
      tableBody = [
        ["John Doe", "City Tech Summit", "8", "$120", "Pending"],
        ["Alice Smith", "Community Marathon", "10", "$150", "Paid"],
      ];
    }

    if (role === "organizer") {
      doc.text("Total Events: 3", 14, 55);
      doc.text("Total Volunteers: 18", 14, 62);
      doc.text("Pending Payments: $120", 14, 69);

      tableHead = ["Volunteer", "Event", "Hours", "Amount", "Status"];
      tableBody = [
        ["John Doe", "City Tech Summit", "8", "$120", "Pending"],
        ["Alice Smith", "Community Marathon", "10", "$150", "Paid"],
      ];
    }

    if (role === "volunteer") {
      doc.text("Completed Tasks: 6", 14, 55);
      doc.text("Total Hours: 42", 14, 62);
      doc.text("Total Earnings: $450", 14, 69);

      tableHead = ["Event", "Date", "Hours", "Amount", "Status"];
      tableBody = [
        ["City Tech Summit", "15 Mar 2025", "8", "$120", "Pending"],
        ["Community Marathon", "10 Feb 2025", "10", "$150", "Paid"],
      ];
    }

    // TABLE
    autoTable(doc, {
      startY: 85,
      head: [tableHead],
      body: tableBody,
    });

    // SAVE FILE
    doc.save(`WorkLink_${role}_Report.pdf`);
  };

  return (
    <div className="app-layout">
      <Sidebar role={role} />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar
          role={role.charAt(0).toUpperCase() + role.slice(1)}
          title="Reports"
        />

        {/* REPORT CARD */}
        <div className="report-card">
          <h3>{role.toUpperCase()} Report</h3>
          <p>
            Generate and download a detailed PDF report containing your activity
            and summary data.
          </p>

          <button className="btn generate" onClick={generatePDF}>
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
