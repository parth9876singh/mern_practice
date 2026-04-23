import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Profile = () => {

    const [user,setUser]  =useState(null);
    const [file,setFile] =useState();

    useEffect (()=>{
        const fetchProfile = async()=>{
            try{
                const res = await axios.get('http://localhost:3000/user/profile', {
                    withCredentials: true
                });

                setUser(res.data);
            }catch(err){
                console.log(err);
            }
        }
            fetchProfile();

    },[]);

     const handleUpload = async()=>{
          try{
    
            const formdata = new FormData();
            formdata.append('image',file);
    
            // axios.post(url, data, config)
            const res = await axios.post('http://localhost:3000/user/uploadImage', formdata, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            console.log(res.data.url);
            setUser({ ...user, image: { url: res.data.url } });
    
          }catch(err){
            console.log(err.response?.data)
          }
        }






 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded shadow w-80">

      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {user ? (
        <>
            {user.image?.url ? (
              <img src={user.image.url} className="w-32 h-32 rounded-full object-cover border" alt="Profile" />
            ) : (
              <div className="w-32 h-32 rounded-full border flex items-center justify-center bg-gray-200">No Image</div>
            )}
            <p><strong>Name: </strong>{user.name}</p>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Role: </strong>{user.role}</p>

        
        </>
      ): (
        <p>Loading....</p>
      )}


       <div>
        <input type="file"  onChange={(e)=> setFile(e.target.files[0])} />
         <button onClick={handleUpload}>Upload</button>
        </div>

    </div>
  </div>
);
}

export default Profile
