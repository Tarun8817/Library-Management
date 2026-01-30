import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route,Link,Navigate } from "react-router-dom"

// Importing all the pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OTP from './pages/OTP';

// Fixed: ResetPassword should be imported from its own file, not ForgotPassword
import ResetPassword from './pages/ResetPassword';

import { ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux';
import { getUser, silentGetUser } from './store/slices/authSlice';
import { fetchAllUsers } from './store/slices/userSlice';
import { fetchAllBooks } from './store/slices/bookSlice';

const App = () => {
  const {user,isAuthenticated} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllBooks())
    // Fetch admin data only when user is authenticated and is admin
    if (isAuthenticated && user?.role === "Admin") {
      console.log("THE LOGGED IN USER IS AN ADMIN");
      dispatch(fetchAllUsers());
    }
  }, [isAuthenticated]);

  
  // Create a protected route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };



  return (
    <Router>
      <Routes>
        {/* Protected Home Page */}
        <Route path='/' element={<Home/>}/>
        {/* Authentication pages */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Forgot password process */}
        <Route path='/password/forgot' element={<ForgotPassword />} />

        {/* OTP verification with email in URL */}
        <Route path='/otp-verification/:email' element={<OTP />} />

        {/* Reset password using token from email */}
        <Route path='/password/reset/:token' element={<ResetPassword />} />

        {/* 404 Route - Must be last */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>

      {/* Toast notifications (dark theme) */}
      <ToastContainer theme='dark' />
    </Router>
  )
}

export default App
