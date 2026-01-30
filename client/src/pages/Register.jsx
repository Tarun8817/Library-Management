import React, { useEffect, useState } from 'react'
import logo from '../assets/black-logo.png';
import logo_white_title from '../assets/logo-with-title.png'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Navigate, Link } from "react-router-dom" 
import { register, resetAuthSlice } from "../store/slices/authSlice"
import { toast } from 'react-toastify'
import logo_with_title from '../assets/logo-with-title.png'
import new_logo from "../assets/Logo_signup.png"

const Register = () => {
  // Local states to store form input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redux dispatch hook
  const dispatch = useDispatch();

  // Get auth state from Redux store
  const { loading, error, message, user, isAuthenticated } = useSelector(
    state => state.auth
  );

  // React Router hook for programmatic navigation
  const navigateTo = useNavigate();

  // Handle Register form submission
  const handleRegister = (e) => {
    e.preventDefault(); // prevent page reload
    const data = new FormData(); // create form data object
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);

    // Dispatch register action
    dispatch(register(data));
  };

  // Watch for auth state changes (error, message, isAuthenticated)
  useEffect(() => {
    if (message) {
      toast.success(message); // Show success toast
      dispatch(resetAuthSlice()); // Reset auth slice after showing message
      navigateTo(`/otp-verification/${email}`); // Redirect to OTP page with email
    }
    if (error) {
      toast.error(error); // Show error toast
      dispatch(resetAuthSlice()); // Reset auth slice after showing error
    }
  }, [dispatch, isAuthenticated, error, loading, message]);  

  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen w-full">
        
        {/* ---------- LEFT SIDE (Black background with Sign In option) ---------- */}
        <div className="hidden md:flex w-1/2 bg-black text-white 
          flex-col items-center justify-center 
          p-8 rounded-tr-[80px] rounded-br-[80px]">

          <div className="flex flex-col items-center justify-center text-center">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
            <p className="text-gray-300 mb-8">Already have Account ? Sign in now.</p>
            
            {/* Link to Login Page */}
            <Link
              to={"/login"}
              className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white 
              hover:text-black transition"
            >
              SIGN IN
            </Link>
          </div>
        </div>

        {/* ---------- RIGHT SIDE (Registration Form) ---------- */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-white p-8">
          <div className="w-full max-w-sm">
            
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-12">
              <img src={logo} alt="logo" className="h-auto w-30 object-cover mb-4"/>
              <h3 className="text-2xl mb-[10px] font-semibold">Sign Up</h3>
            </div>

            <p className="text-gray-800 text-center mb-8">
              Please provide your information to signup
            </p>

            {/* Register Form */}
            <form onSubmit={handleRegister}>
              
              {/* Name input */}
              <div className="mb-6">
                <input 
                  type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              {/* Email input */}
              <div className="mb-6">
                <input 
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              {/* Password input */}
              <div className="mb-6">
                <input 
                  type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              {/* Mobile-only Sign In link (shows below form) */}
              <div className="block md:hidden font-semibold mt-5 text-center">
                <p>
                  Already have Account?{" "}
                  <Link to="/login" className="text-sm text-gray-500 hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="border-2 text-2xl border-black w-full font-semibold bg-black text-white py-2  rounded-lg hover:bg-white hover:text-black transition"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
