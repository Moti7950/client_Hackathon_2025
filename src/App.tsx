import { Route, Routes } from "react-router-dom";

import "./App.css";
import Login from "./components/login";
import DroneMap from "./components/zeekLive";
import HomePage from "./components/home-page";
import MapView from "./components/MapView";
import ProtectedRoute from "./contexts/ProtectedRoute";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/homePage" element={<HomePage />}>
          <Route index element={<MapView />} />     {/* /homePage */}
          <Route path="zeek" element={<DroneMap />} /> {/* /homePage/zeek */}
        </Route>
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
