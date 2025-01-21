import React from 'react';
import Navbar from './Navbar'; 
import { useState,useEffect } from 'react';

function Dashboard() {
  const[userName,setUsername]=useState();
  return (
    <div>
      <Navbar /> 

      <h1>Welcome,{userName}</h1>
    </div>
  );
}

export default Dashboard;
