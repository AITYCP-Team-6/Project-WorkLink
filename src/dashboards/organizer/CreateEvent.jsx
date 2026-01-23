import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./CreateEvent.css";
import { useEvents } from "../../context/EventContext";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    slots: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addEvent({
      id: Date.now(),
      title: form.title,
      org: "Organizer",
      date: form.date,
      location: form.location,
      slots: `0/${form.slots} slots filled`,
      description: form.description,
      applied: false,
    });

    navigate("/organizer");
  };

  return (
    <div className="app-layout">
      <Sidebar role="organizer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Organizer" title="Create Event" />

        {/* FORM */}
        <div className="create-event-wrapper">
          <form className="event-form" onSubmit={handleSubmit}>
            <h3>Create New Event</h3>

            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="slots"
              placeholder="Total Slots"
              value={form.slots}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event Description"
              rows="4"
              value={form.description}
              onChange={handleChange}
            />

            <button type="submit" className="btn create">
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
