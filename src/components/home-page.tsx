import { Link } from "react-router";
<<<<<<< HEAD
import '../style/homePage.css';
=======
import MapView from "./MapView";
>>>>>>> a4b3bdef22ad46379527c544f513ef57fbe92ef1

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
