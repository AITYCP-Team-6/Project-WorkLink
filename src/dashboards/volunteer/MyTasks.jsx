import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./MyTasks.css";
import { useVolunteer } from "../../context/VolunteerContext";

const MyTasks = () => {
  const { tasks, markTaskCompleted } = useVolunteer();

  return (
    <div className="app-layout">
      <Sidebar role="volunteer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Volunteer" title="My Tasks" />

        <div className="table-card my-tasks">
          <h3>Assigned Tasks</h3>

          {tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
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
                            onClick={() => markTaskCompleted(task.id)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
