import { Link ,useNavigate } from "react-router";

export default function Footer() {
   const nav = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("isAuthed");
    nav("/");
  };
  return (
     <footer>
      <button onClick={logout}>⏮ Log out</button>
    </footer>
  );
}
