import React, { useState, useEffect } from 'react'
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { resetAuthSlice, login } from '../store/slices/authSlice';

const Login = () => {
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redux dispatch
  const dispatch = useDispatch();

  // Get auth state from Redux store
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault(); // prevent page reload
    const data = new FormData(); // create FormData for backend
    data.append("email", email);
    data.append("password", password);

    // Dispatch Redux login action
    dispatch(login(data));
  }

  // Watch for changes in error / success / loading
  useEffect(() => {
    // If login succeeds and you want to show message, uncomment:
    // if (message) {
    //   toast.success(message);
    //   dispatch(resetAuthSlice());
    // }

    if (error) {
      toast.error(error);       // show error toast
      dispatch(resetAuthSlice()); // clear Redux auth slice
    }
  }, [dispatch, isAuthenticated, error, loading]);

  // If user is already logged in → redirect to home
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        
        {/* ---------- LEFT SIDE (Login Form Section) ---------- */}
        <div className="w-full md:w-1/2 bg-white text-black flex 
          flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">

          <div className="text-center h-[500px] w-full max-w-sm flex flex-col justify-center">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-medium text-center mb-4">
              Welcome Back!!
            </h1>
            <p className="text-gray-700 text-center mb-8">
              Please enter your credentials to login
            </p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none "
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none "
                />
              </div>

              {/* Forgot Password link */}
              <div className="flex justify-between items-center">
                <Link 
                  to={"/password/forgot"} 
                  className="font-semibold text-lg text-gray-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Mobile only → Sign Up link */}
              <div className='block md:hidden text-gray-600'>
                <p>
                  New to our platform?{" "}
                  <Link 
                    to={"/register"} 
                    className='text-sm text-gray-500 hover:underline'>
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 
                  rounded-lg hover:bg-white hover:text-black transition"
                disabled={loading} // disable while login is processing
              >
                SIGN IN
              </button>
            </form>
          </div>
        </div>

        {/* ---------- RIGHT SIDE (Promo Section) ---------- */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex 
          flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]" >

          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-12 ">
              <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
            </div>

            <p className="text-gray-300 mb-12">
              New to our platform? Sign up now.
            </p>

            {/* Sign Up Button */}
            <Link
              to={"/register"} 
              className="border-2 mt-5 border-white px-8 w-full font-semibold bg-black text-white py-2 
                rounded-lg hover:bg-white hover:text-black transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;
