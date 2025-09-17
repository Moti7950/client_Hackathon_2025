import { Route, Routes } from "react-router";

import "./App.css";
import Login from "./components/login";
import ZeekLive from "./components/zeekLive";
import HomePage from "./components/home-page";
import MapView from "./components/MapView";
import ProtectedRoute from "./contexts/ProtectedRoute";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/homePage" element={<HomePage />}>
            <Route index element={<MapView />} />
            <Route path="/homePage/zeek" element={<ZeekLive />} />
          </Route>
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
