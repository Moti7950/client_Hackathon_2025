import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthed = sessionStorage.getItem("isAuthed") === "true";
  return isAuthed ? <Outlet /> : <Navigate to="/" replace />;
}
