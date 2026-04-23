import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("Login Data:", form);

    try{
      const res = await axios.post('http://localhost:3000/user/login', form, {
        withCredentials: true
      });
      console.log(res.data);
      

      const token  = res.data.token;
      console.log("Login Sucesfully");
      setForm({
        email:"",
        password:"",
      })
      if(token){
        navigate("/");
      }

    }catch(err){
      console.log(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded-lg"
          onChange={handleChange}
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Login
        </button>

        <p><a href='/forget-password'>Forget Password</a> </p>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login
