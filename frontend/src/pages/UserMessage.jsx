import React, { useEffect, useState } from 'react'
import {io} from 'socket.io-client'

const socket = io('http://localhost:3000')

const UserMessage = () => {

    const [msg,setMsg] = useState();

    useEffect(()=>{
        socket.on("notification",(msg)=>{
            setMsg(msg);
        })
        return ()=>socket.off("notification")
    },[]);


  return (
    <div>

        <h2>User dashboard</h2>

        {msg &&(
           <div className="bg-green-200 p-2">
          🔔 {msg}
        </div>
        )}
      
    </div>
  )
}

export default UserMessage
