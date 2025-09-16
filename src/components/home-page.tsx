import { Link } from "react-router";
import MapView from "./MapView";

export default function HomePage() {
  return (
    <>
      <header>
        <button>Camera </button>
        <button>soldier locations</button>
        <button>Intelligence by waypoints</button>
      </header>
      <MapView />

      <footer>
        <Link to={"/"}> ⏮ Log out</Link>
      </footer>
    </>
  );
}
