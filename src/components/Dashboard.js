import React from 'react';
import Navbar from './Navbar'; 
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Dashboard() {
  const navigate=useNavigate();
  const[userName,setUsername]=useState();

  // useEffect(()=>{
  //   async function fetchdata(){
  //     try{
  //       const response= await axios.get('/dashboard');
  //       if(response.status===200){
  //         setUsername(response.data.user.name);
  //       }
  //     }
  //     catch(error){
  //       console.log(error);
  //       navigate('/')
  //     }
  //   }
  //   fetchdata();
  // },[])

  useEffect(() => {
    async function fetchdata() {
        try {
            const response = await axios.get('/dashboard');
            if (response.status === 200) {
                setUsername(response.data.user.name); // Use response.data
            }
        } catch (error) {
            console.log(error);
            navigate('/');
        }
    }
    fetchdata();
}, []);


  return (
    <div>
      <Navbar /> 

      <h1>Welcome,{userName}</h1>
    </div>
  );
}

export default Dashboard;
