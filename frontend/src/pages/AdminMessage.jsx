import React, { useState } from 'react'
import axios from 'axios'
const AdminMessage = () => {

    const[msg,setMsg] = useState();




        const handleSubmit = async()=>{
           await axios.post('http://localhost:3000/user/message',{message:msg});

            setMsg(" ");
            
        };
        


  return (
    <div>

    <input type='text' placeholder='write msg' onChange={(e)=>setMsg(e.target.value)}/>;
    <button onClick={handleSubmit} >Send</button>
      
    </div>
  )
}

export default AdminMessage
