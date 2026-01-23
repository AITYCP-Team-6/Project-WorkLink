import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { EventProvider } from "./context/EventContext";
import { VolunteerProvider } from "./context/VolunteerContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <EventProvider>
        <VolunteerProvider>
          <App />
        </VolunteerProvider>
      </EventProvider>
    </AuthProvider>
  </BrowserRouter>,
);
