import { createContext, useContext, useState } from "react";

const VolunteerContext = createContext();

export const VolunteerProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);

  const applyForEvent = (evt) => {
    setApplications((prev) => [
      ...prev,
      {
        id: evt.id,
        event: evt.title,
        organizer: evt.org,
        role: "Volunteer",
        date: evt.date,
        hours: 8,
        status: "pending",
      },
    ]);
  };

  const approveApplication = (id) => {
    const approvedApp = applications.find((app) => app.id === id);
    if (!approvedApp) return;

    setTasks((prev) => [...prev, { ...approvedApp, status: "active" }]);

    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const markTaskCompleted = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task,
      ),
    );
  };

  return (
    <VolunteerContext.Provider
      value={{
        applications,
        tasks,
        applyForEvent,
        approveApplication,
        markTaskCompleted,
      }}
    >
      {children}
    </VolunteerContext.Provider>
  );
};

export const useVolunteer = () => useContext(VolunteerContext);
