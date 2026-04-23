import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {

    const {token} = useParams();
    const [pass,setpass] = useState();
    const [msg,setMsg] = useState();
    const navigate =useNavigate();


    const handleSubmit = async(e)=>{
        e.preventDefault();

        try{

            const res = await axios.post(`http://localhost:3000/user/resetPassword/${token}`,{password: pass});

            setMsg(res.data.msg);
            navigate('/login');


        }catch(err){
            console.log(err.response?.data);
        }
    }

  return (
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setpass(e.target.value)}
        />

        <button>Reset Password</button>
      </form>

      <p>{msg}</p>
    </div>
  )
}

export default ResetPassword
