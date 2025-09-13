import React, { useState } from 'react'
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import 
const Login = () => {
  const [email,setEmail] = useState("");
  const [Password,setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) =>{
    e.preventDefault();
    const data = new FormData();
    data.append("email",email);
    data.append("password",Password);
    dispatch(login(data));
  }
  return (
    <div>
      login
    </div>
  )
}

export default Login;
