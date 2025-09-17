import React, { useContext } from "react";
import "../styles/login.css";
import { RoleContext } from "../contexts/role.context";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";


export default function Login() {
  const role = useContext(RoleContext);
  const navigate = useNavigate()
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onsubmit = async () => {
    console.log(username, password);
    const data = await fetch(`${BASE_URL}/users/checkUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await data.json();
    role?.setRole(result.role);
    console.log(result.status);
    if (result.status) {
      sessionStorage.setItem("isAuthed", "true");
      navigate("/homePage")
    } else {
      sessionStorage.removeItem("isAuthed");
      alert("Invalid credentials, please try again.");
    }
  };

  return (
    <>
      <main className="login-main">
        <div id="divImg">
          <img src="Aman.png" alt="" id="haman" />
          <img src="logo.png" alt="" id="logo" />
        </div>
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
          <div className="button-row">
            <button id="btnLogin" onClick={onsubmit}>
              Log in
            </button>
          </div>
        </section>
        <p>!סודי ביותר</p>
      </main>
    </>
  );
}
