import { Link } from "react-router";

export default function Footer() {
  return (
    <>
      <footer>
        <Link to={"/"}> ⏮ Log out</Link>
      </footer>
    </>
  );
}
