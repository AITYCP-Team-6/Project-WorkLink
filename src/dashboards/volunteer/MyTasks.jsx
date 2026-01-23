import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./MyTasks.css";

const MyTasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      event: "City Tech Summit 2025",
      organizer: "TechFlow Events",
      role: "Registration Desk",
      date: "15 Mar 2025",
      hours: 8,
      status: "active",
    },
    {
      id: 2,
      event: "Community Marathon",
      organizer: "City Sports Dept",
      role: "Water Station",
      date: "10 Feb 2025",
      hours: 10,
      status: "completed",
    },
  ]);

  const markCompleted = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task,
      ),
    );
  };

  return (
    <div className="app-layout">
      <Sidebar role="volunteer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Volunteer" title="My Tasks" />

        {/* TASKS TABLE */}
        <div className="table-card my-tasks">
          <h3>Assigned Tasks</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Organizer</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th className="actions-col">Action</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.event}</td>
                    <td>{task.organizer}</td>
                    <td>{task.role}</td>
                    <td>{task.date}</td>
                    <td>{task.hours}</td>
                    <td>
                      <span
                        className={`status ${
                          task.status === "completed" ? "completed" : "active"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="actions">
                      {task.status === "active" ? (
                        <button
                          className="btn complete"
                          onClick={() => markCompleted(task.id)}
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="done-text">✔ Completed</span>
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

export default MyTasks;
