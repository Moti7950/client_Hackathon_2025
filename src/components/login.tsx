// components/Login.tsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../utility/fetchFunctions";

export default function Login() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  

  const onClickLogin = () => {
    const userName = userNameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    handleLogin(userName, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" ref={userNameRef} />
      <input type="password" placeholder="Password" ref={passwordRef} />
      <button onClick={onClickLogin}>Login</button>
    </div>
  );
}
