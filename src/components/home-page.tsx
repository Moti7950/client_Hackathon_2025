import { Link } from "react-router";
import '../style/homePage.css';

export default function HomePage() {
  return (
    <>
      <header>
        <button>Camera </button>
        <button>soldier locations</button>
        <button>Intelligence by waypoints</button>
      </header>
      <footer>
        <Link to={"/"}> ⏮ Log out</Link>
      </footer>
    </>
  );
}
