import { NavigateFunction } from "react-router-dom";


export async function checkExists(userName: string, password: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:6578/users/checkUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}


export async function handleLogin(
  userName: string,
  password: string,
 
): Promise<void> {
  if (!userName || !password) {
    alert("Please enter both username and password");
    return;
  }

  const isValid = await checkExists(userName, password);
  if (isValid) {
    console.log("hi")
  } else {
    alert("Invalid username or password");
  }
}



