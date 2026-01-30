import { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useParams, Navigate, Link } from "react-router-dom"; // 👈 you forgot Link import earlier
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice, clearMessages } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  // Get email from URL (e.g., /otp-verification/:email)
  const { email } = useParams();

  // Redirect if no email in URL
  if (!email) {
    return <Navigate to="/register" />;
  }

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

    // Basic validation
    if (!otp || otp.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP");
      return;
    }

    // Dispatch Redux action with email + OTP
    dispatch(otpVerification(email, otp));
  };

  // Side effects for error/success handling
  useEffect(() => {
    if (message) {
      toast.success(message);
      // Only clear messages, don't reset authentication state
      setTimeout(() => dispatch(clearMessages()), 2000);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

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
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 absolute 
          top-10 left-10 hover:bg-black hover:text-white transition duration-300 text-center"
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
            <p className="text-gray-800 text-center mb-4">
              We've sent a 5-digit code to <strong>{email}</strong>
            </p>
            <p className="text-gray-600 text-center mb-8 text-sm">
              Please enter the OTP to proceed
            </p>

            {/* OTP Form */}
            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 5) {
                      setOtp(value);
                    }
                  }}
                  placeholder="Enter 5-digit OTP"
                  maxLength="5"
                  className="w-full px-4 py-3 border border-black rounded-md focus:outline-none text-center text-lg tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 
                rounded-lg hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || otp.length !== 5}
              >
                {loading ? "VERIFYING..." : "VERIFY"}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <Link
                  to="/register"
                  className="text-black font-semibold hover:underline"
                >
                  Try again
                </Link>
              </p>
            </div>
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
