
import './App.css'
import Login from './components/login'
import GazaZoomMap from './components/gazaStrip';
function App() {
  return (
    <>
      <RoleProvider>
        <Login />
      </RoleProvider>
    </>
  );
}

export default App;
