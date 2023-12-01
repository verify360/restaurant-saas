import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/ownerLogin.css";

const Login = () => {

    const navigate = useNavigate();

    const [owner,setOwner] = useState({
        username: "",password: ""
    });

    let name,value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        
        setOwner({ ...owner, [name]:value});
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { username, password } = owner;
        try {
            const res = await fetch("/owner-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,password,
            }),
          });
      
          const data = await res.json();
      
          if (res.status === 400 || !data) {
            window.alert("Invalid Credentials.");
          } else if (res.status === 201) {
            window.alert("Logged in Successfully.");
            navigate("/owner-home");
          } else {
            window.alert("Error:", data.message); 
          }
        } catch (error) {
          window.alert("Error:", error.message);
        }
    };
      
  return (
    <>
      <div className="form-container">
        <h2>Restaurant Owner Login</h2>
        <form id="signup-form" onSubmit={(e) => { handleLogin(e)}}>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" placeholder='Enter Your Username' required value={owner.username} onChange={handleInputs}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder='Enter The Password' required value={owner.password} onChange={handleInputs}/>
            </div>
            <button type="submit" className="submit-btn button">Login</button>
        </form>
        <br/>
        <p>New here? <Link to="/owner-registration">Register here</Link></p>
    </div>
    </>
  )
}

export default Login;

