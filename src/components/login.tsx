import { useNavigate } from "react-router";
import '../style/login.css';

export default function Login() {
  let navigate = useNavigate();
  return (
    <>
      <main>
        <img src="אמן.png" alt="" id="haman" />
        <section id="sectionInput">
          <input type="text" placeholder="enter your name" />
          <input type="text" placeholder="enter password" />
          <button onClick={() => navigate("/homePage")}>Log in</button>
        </section>
        <p>!סודי ביותר</p>
      </main>
    </>
  );
}
