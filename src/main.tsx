import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./components/home-page.tsx";
import LocationsProvider from "./contexts/locations.context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocationsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/homePage" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </LocationsProvider>
  </StrictMode>
);
