import { useRef, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';


export default function Login() {
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate(); 


  const verifyUser = async () => {
    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;

    const response = await fetch('http://your-api.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });

    const result = await response.json();
    console.log(result)

    if (result.found) {
      alert('Welcome!');
      navigate('/homePage'); 
    } else {
      alert('User not found!');
    }
  };

  const handleSubmit = (e :any) => {
    e.preventDefault();
    verifyUser();
  };

 
  return (
    <>
      <form onSubmit={handleSubmit}>
        <img src="אמן.png" alt="" id="haman"/>
        <input type="text" placeholder="enter your name" ref={userNameRef} />
        <input type="text" placeholder="enter password" ref={passwordRef} />
         
        <p>!סודי ביותר</p>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
