import React from 'react'
import Profile from './Profile'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {

     const res= await axios.get('http://localhost:3000/user/logout', {
        withCredentials: true
      });
      console.log(res.data);
      navigate('/login');
    } catch (err) {
      console.log(err.response?.data);
    }
  }
  return (
    <div>


      <button onClick={handleLogout}>Logout</button>;



      <Profile />

    </div>
  )
}

export default Home
