import { Route, Routes } from "react-router-dom";

import "./App.css";
import Login from "./components/login";
import DroneMap from "./components/zeekLive";
import HomePage from "./components/home-page";
import MapView from "./components/MapView";
import ProtectedRoute from "./contexts/ProtectedRoute";
import { DroneProvider } from "./contexts/Drone.context";

export default function App() {
   return (
    <DroneProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/homePage" element={<HomePage />}>
            <Route index element={<MapView />} />
            <Route path="zeek" element={<DroneMap />} />
          </Route>
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </DroneProvider>
  );
}
