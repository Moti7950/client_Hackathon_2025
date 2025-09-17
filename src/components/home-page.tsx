import "../styles/homePage.css";
import Footer from "./footer";
import Header from "./header";
import { Outlet } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <div className="layout">
        <nav>
          <Header />
        </nav>
        <main>
            <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}
