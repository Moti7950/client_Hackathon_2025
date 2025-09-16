import "./App.css";
import Login from "./components/login";
import RoleProvider from "./contexts/role.context";

function App() {
  return (
      <RoleProvider>
        <Login />
      </RoleProvider>
  );
}

export default App;
