import "../styles/homePage.css";
import Footer from "./footer";
import Header from "./header";
import MapView from "./MapView";
import GazaZoomMap from "./gazaStrip";

export default function HomePage() {
  return (
    <>
      <header>
        <Header />
      </header>
      <MapView />
      <GazaZoomMap />
      <footer>
        <Footer />
      </footer>
    </>
  );
}
