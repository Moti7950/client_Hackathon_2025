import { useNavigate } from "react-router";

export default function Login() {
  let navigate = useNavigate();
  return (
    <>
      <main>
        <img src="אמן.png" alt="" id="haman"/>
        <input type="text" placeholder="enter your name" />
        <input type="text" placeholder="enter password" />
        <button onClick={() => navigate("/homePage")}>Log in</button>
        <p>!סודי ביותר</p>
      </main>
    </>
  );
}
