import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Test from './pages/Test'
import ForgetPassword from './pages/ForgetPassword'
import ResetPassword from './pages/ResetPassword'
import UserMessage from './pages/UserMessage'
import AdminMessage from './pages/AdminMessage'

const App = () => {
  return (
    <>
    
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/login' element={<Login />} ></Route>
      <Route path='/register' element={<Register />} ></Route>
      <Route path='/test' element={<Test />}></Route>
      <Route path='/forget-password' element={<ForgetPassword />}></Route>
      <Route path='/reset-password/:token' element={<ResetPassword />}></Route>

      <Route path='/user-msg' element={<UserMessage />} ></Route>
      <Route path='/admin-msg' element={<AdminMessage />} ></Route>
    
    </Routes>
    
    </>
  )
}

export default App
