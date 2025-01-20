import logo from './logo.svg';
import './App.css';
import Signin from './components/Signin'
import Signup from './components/Signup'
import Profile from './components/Profile'
import {Routes,Route} from 'react-router-dom'
import Dashboard from './components/Dashboard';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/profile/*" element={<Profile/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </>
  );
}

export default App;
