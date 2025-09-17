import React, { useContext } from "react";
import "../styles/login.css";
import { RoleContext } from "../contexts/role.context";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";


export default function Login() {
  const role = useContext(RoleContext);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  let navigate = useNavigate();

  const onsubmit = async () => {
    console.log(username, password);
    const data = await fetch("http://localhost:6578/users/checkUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const result = await data.json();
    role?.setRole(result.role);
    console.log(result.status);
    if (result.status) {
      navigate("/homepage");
    } else {
      alert("Invalid credentials, please try again.");
    }
  };

  return (
    <>
      <main>
        <img src="Aman.png" alt="" id="haman" />
        <section id="sectionInput">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="enter your name"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter password"
          />
          <button id="btnLogin" onClick={onsubmit}>Log in</button>
        </section>
        <p>!סודי ביותר</p>
      </main>
    </>
  );
}
