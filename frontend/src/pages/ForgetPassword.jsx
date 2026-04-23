import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {

    const [email,setEmail] = useState();
    const [msg,setMsg] = useState()

    const handleSubmit = async(e)=>{
        e.preventDefault();

        try{

            const res = await axios.post('http://localhost:3000/user/forgetPassword',{email})

            console.log(res.data.token);
            setMsg("Check email for password reset");

        }catch(err){
            console.log(err.response?.data);
        }
    }
 



  return (
    <div>

        <div>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button>Send Reset Link</button>
      </form>

      <p>{msg}</p>
    </div>
      
    </div>
  )
}

export default ForgetPassword
