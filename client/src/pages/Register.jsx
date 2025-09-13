import React, { useEffect, useState } from 'react'
import logo from '../assets/black-logo.png';
import logo_white_title from '../assets/logo-with-title.png'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Navigate, Link } from "react-router-dom" 
import { register, resetAuthSlice } from "../store/slices/authSlice"
import { toast } from 'react-toastify'
import logo_with_title from '../assets/logo-with-title.png'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    state => state.auth
  );

  const navigateTo = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name)
    data.append("email", email)
    data.append("password", password)
    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigateTo(`/otp-verification/${email}`);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);  

  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen w-full">
  {/* LEFT SIDE */}
  <div className="hidden md:flex w-1/2 bg-black text-white 
    flex-col items-center justify-center 
    p-8 rounded-tr-[80px] rounded-br-[80px]">

    <div className="flex flex-col items-center justify-center text-center">
      <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
      <p className="text-gray-300 mb-8">Already have Account ? Sign in now.</p>
      <Link
        to={"/login"}
        className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white 
        hover:text-black transition"
      >
        SIGN IN
      </Link>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex w-full md:w-1/2 items-center justify-center bg-white p-8">
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-12">
        <img src={logo} alt="logo" className="h-auto w-24 object-cover mb-4"/>
        <h3 className="text-xl font-semibold">Sign Up</h3>
      </div>

      <p className="text-gray-800 text-center mb-8">
        Please provide your information to signup
      </p>

      <form onSubmit={handleRegister}>
        <div className="mb-6">
          <input 
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <input 
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <input 
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
          />
        </div>

        {/* Mobile Sign In link */}
        <div className="block md:hidden font-semibold mt-5 text-center">
          <p>
            Already have Account?{" "}
            <Link to="/login" className="text-sm text-gray-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <button
          type="submit"
          className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
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
