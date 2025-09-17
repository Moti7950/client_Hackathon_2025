// import { useNavigate } from "react-router";
// import React, { useContext } from "react";
// import "../styles/login.css";
// import { RoleContext } from "../contexts/role.context";

// export default function Login() {
//   const role = useContext(RoleContext);
//   const [username, setUsername] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   let navigate = useNavigate();

//   const onsubmit = async () => {
//     console.log(username, password);
//     const data = await fetch("http://localhost:6578/users/checkUser", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     });
//     const result = await data.json();
//     role?.setRole(result.role);
//     console.log(result.status);
//     if (result.status) {
//       navigate("/homepage");
//     } else {
//       alert("Invalid credentials, please try again.");
//     }
//   };

//   return (
//     <>
//       <main>
//         <img src="Aman.png" alt="" id="haman" />
//         <section id="sectionInput">
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="enter your name"
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="enter password"
//           />
//           <button id="btnLogin" onClick={onsubmit}>Log in</button>
//         </section>
//         <p>!סודי ביותר</p>
//       </main>
//     </>
//   );
// }













import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:6578/users/checkUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      navigate("/homePage");
    } else {
      alert("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <main className="login-container">
      <header className="login-header">
        <img src="Aman.png" alt="Aman Logo" className="aman-logo" />
        <p className="top-secret">!סודי ביותר</p>
      </header>

      <section className="login-box">
        <h2>התחברות</h2>
        <input
          type="text"
          placeholder="שם משתמש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>כניסה</button>
      </section>
    </main>
  );
}
