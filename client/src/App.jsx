import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Importing all the pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OTP from './pages/OTP';

// Fixed: ResetPassword should be imported from its own file, not ForgotPassword
import ResetPassword from './pages/ResetPassword';

import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path='/' element={<Home />} />

        {/* Authentication pages */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Forgot password process */}
        <Route path='/password/forgot' element={<ForgotPassword />} />

        {/* OTP verification with email in URL */}
        <Route path='/otp-verification/:email' element={<OTP />} />

        {/* Reset password using token from email */}
        <Route path='/password/reset/:token' element={<ResetPassword />} />
      </Routes>

      {/* Toast notifications (dark theme) */}
      <ToastContainer theme='dark' />
    </Router>
  )
}

export default App
