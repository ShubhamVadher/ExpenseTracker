import logo from './logo.svg';
import './App.css';
import './index.css';
import Signin from './components/Signin'
import Signup from './components/Signup'
import Profile from './components/Profile'
import {Routes,Route} from 'react-router-dom'
import Dashboard from './components/Dashboard';
import DuesPage from './components/DuesPage';
import EditDues from './components/EditDues';
import Stocks from './components/Stocks';
import Groups from './components/Groups';
import Groupdetails from './components/Groupdetails';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/profile/*" element={<Profile/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/Dues" element={<DuesPage></DuesPage>}></Route>
        <Route path='/editdues/:id' element={<EditDues/>}></Route>
        <Route path='/stocks' element={<Stocks/>}></Route>
        <Route path='/groups' element={<Groups/>}></Route>
        <Route path='/group/:id' element={<Groupdetails/>}></Route>
      </Routes>
    </>
  );
}

export default App;
