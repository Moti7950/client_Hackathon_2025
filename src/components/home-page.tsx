import "../styles/homePage.css";
import Footer from "./footer";
import Header from "./header";
import MapView from "./MapView";

export default function HomePage() {
  return (
    <>
      <header>
        <Header />
      </header>
      <MapView />
      <footer>
        <Footer />
      </footer>
    </>
  );
}
