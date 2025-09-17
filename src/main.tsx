import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import LocationsProvider from "./contexts/Locations.context";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LocationsProvider>
        <App />
      </LocationsProvider>
    </BrowserRouter>
  </StrictMode>
);
