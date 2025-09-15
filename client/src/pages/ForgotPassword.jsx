import React, { useEffect, useState } from 'react';
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, Navigate } from "react-router-dom";
import { forgotPassword, resetAuthSlice } from '../store/slices/authSlice';

const ForgotPassword = () => {
  // Local state to store email input
  const [email, setEmail] = useState("");

  // Redux hooks
  const dispatch = useDispatch();

  // Get auth state from Redux store
  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Handle form submit → dispatch forgotPassword action
  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  // Handle toast notifications & reset Redux state after each request
  useEffect(() => {
    if (message) {
      toast.success(message); // show success message
      dispatch(resetAuthSlice()); // reset state after showing toast
    }
    if (error) {
      toast.error(error); // show error message
      dispatch(resetAuthSlice()); // reset state after showing toast
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  // If already logged in → redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* LEFT SECTION (only visible on md+ screens) */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
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

      {/* RIGHT SECTION (form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        {/* Back button → navigate to login */}
        <Link
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed 
          top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
          to={"/login"}
        >
          Back
        </Link>

        {/* Form container */}
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12">
            <div className="flex items-center justify-center">
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-medium text-center mb-5 overflow-hidden">
            Forgot Password
          </h1>
          <p className="text-gray-800 text-center mb-12">
            Please enter your email
          </p>

          {/* Forgot password form */}
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 
                rounded-lg hover:bg-white hover:text-black transition"
              disabled={loading ? true : false} // disable while request is loading
            >
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
