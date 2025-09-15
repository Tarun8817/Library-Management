import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useParams, Navigate, Link } from "react-router-dom"; // 👈 you forgot Link import earlier
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  // Get email from URL (e.g., /otp-verification/:email)
  const { email } = useParams();

  // Local state for storing OTP input
  const [otp, setOtp] = useState("");

  // Redux dispatch
  const dispatch = useDispatch();

  // Get auth state from Redux
  const { loading, error, message, isAuthenticated } = useSelector(
    state => state.auth
  );

  // Handle OTP form submission
  const handleOtpVerification = (e) => {
    e.preventDefault();
    // Dispatch Redux action with email + OTP
    dispatch(otpVerification({ email, otp }))
  };

  // Side effects for error/success handling
  useEffect(() => {
    // If you want to show success, uncomment this:
    // if (message) {
    //   toast.success(message);
    // }
    if (error) {
      toast.error(error);       // show error toast
      dispatch(resetAuthSlice()); // clear auth state
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  // If user is already authenticated → redirect to home page
  if (isAuthenticated) {
    return <Navigate to={"/"} />
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen">
      
      {/* ---------- LEFT SIDE (Form Section) ---------- */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        
        {/* Back Button */}
        <Link 
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 fixed 
          top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
          to={"/register"} 
        >
          Back
        </Link>

        <div className="max-w-sm w-full">
          <div className="flex flex-col items-center mb-12">
            
            {/* Logo */}
            <div className="rounded-full flex items-center justify-center mb-6">
              <img src={logo} alt="logo" className="h-24 w-auto" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-medium text-center mb-6 overflow-hidden">
              Check your Mailbox
            </h1>
            <p className="text-gray-800 text-center mb-8">
              Please enter the OTP to proceed
            </p>

            {/* OTP Form */}
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <input 
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 
                rounded-lg hover:bg-white hover:text-black transition"
                disabled={loading} // 👈 disable button while loading
              >
                VERIFY
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* ---------- RIGHT SIDE (Promo Section) ---------- */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex 
        flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
        
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="logo" className="mb-12 h-44 w-auto" />
          </div>

          <p className="text-gray-300 mb-12">
            New to our platform? Sign up now.
          </p>

          {/* Link to Registration Page */}
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
  );
};

export default OTP;
