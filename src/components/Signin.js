import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function Signin() {
    const navigate=useNavigate();
    const[FormData,setFormData]=useState({email:'',password:''});
    const[err,seterr]=useState('');
    const changed=(e)=>{
        const{name,value}=e.target;
        setFormData(
            {...FormData,
            [name]:value}
        )
    }
    const submited=async()=>{
        try{
            const response=await axios.post('/signin',FormData);
            if(response.status===200){
                navigate('/profile');
            }
        }
        catch(error){
            if(error.response&&error.response.data.message){
                seterr(error.response.data.message);
            }
            else{
                seterr("Something went Wrong");
            }
        }

    }


  return (
    <>
        <form onSubmit={submited}>
            <input type="email" required name="email" value={FormData.email} placeholder='Email' onChange={changed}/>
            <input type="password" required name='password' value={FormData.password} placeholder='Password' onChange={changed}/>
            <button>Submit</button>
        </form>
        <p>{err}</p>
    </>
  )
}

export default Signin
