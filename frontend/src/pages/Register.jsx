import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export default function Register() {

  const navigate = useNavigate();

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:""
  }
  );
  
  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    console.log("Form data",form);

    try{

      const res = await axios.post('http://localhost:3000/user/register',form,);
      console.log(res.data);

      setForm({
        name:"",
        email:"",
        password:"",

      })

      navigate("/login")

    }catch(err){
      console.log(err.response?.data);
    }
  }
   
  


  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded-lg"
          onChange={handleChange}
        />

       

        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-500">
            Login
          </a>
        </p>
      </form>
      <div>
      
      
      </div>

    </div>
  );
}