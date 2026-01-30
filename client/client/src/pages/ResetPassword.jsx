import React, { useState, useEffect } from 'react'
import { Link, Navigate, useParams } from "react-router-dom"
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png"
import { useDispatch, useSelector } from 'react-redux';
import { resetAuthSlice, resetPassword } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  // Local state to store password and confirm password input
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get "token" from the URL (example: /reset/:token)
  const { token } = useParams();

  // Redux hooks
  const dispatch = useDispatch();
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth // Access auth state from Redux
  );

  // Form submit handler
  const handleResetPassword = (e) => {
    e.preventDefault(); // Prevent page reload
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    // Dispatch Redux action to reset password (API call)
    dispatch(resetPassword(formData, token));
  }

  // Side effects when message/error/isAuthenticated changes
  useEffect(() => {
    if (message) {
      toast.success(message); // Show success message
      dispatch(resetAuthSlice()); // Clear auth state in Redux
    }
    if (error) {
      toast.error(error); // Show error message
      dispatch(resetAuthSlice()); // Clear auth state in Redux
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  // If user is already authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className='flex flex-col justify-center md:flex-row h-screen'>
      
      {/* ---------- LEFT SECTION (Visible on md+ screen only) ---------- */}
      <div className='hidden w-full md:w-1/2 bg-black text-white md:flex flex-col 
      items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]'>
        <div className="text-center h-[450px]">
          <div className="flex justify-center mb-12">
            <img
              src={logo_with_title}
              alt="logo"
              className="mb-12 h-44 w-auto"
            />
          </div>
          <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-10">
            "Your premier digital library for borrowing and reading books"
          </h3>
        </div>
      </div>

      {/* ---------- RIGHT SECTION (Form area) ---------- */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        
        {/* Back button */}
        <Link
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 absolute 
                top-10 left-10 hover:bg-black hover:text-white transition duration-300 text-center"
          to={"/password/forgot"}
        >
          Back
        </Link>

        {/* Form container */}
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center justify-center">
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-medium text-center mb-5 overflow-hidden">
            Reset Password
          </h1>
          <p className="text-gray-800 text-center mb-12">
            Please enter your New password
          </p>

          {/* Reset password form */}
          <form onSubmit={handleResetPassword}>
            {/* Password input */}
            <div className="mb-4">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>

            {/* Confirm password input */}
            <div className="mb-4">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 
                      rounded-lg hover:bg-white hover:text-black transition"
              disabled={loading ? true : false} // Disable while loading
            >
              RESET PASSWORD
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
