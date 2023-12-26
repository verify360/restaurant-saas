import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/ownerLogin.css";

const Registration = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, password, email, fullName, phoneNumber } = owner;

    try {
      const res = await fetch("/owner-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, password, email, fullName, phoneNumber,
        }),
      });

      const data = await res.json();

      if (res.status === 422 || !data) {
        window.alert("All Fields are Mandatory.");
      } else if (res.status === 421) {
        window.alert("User Exist. Enter a different Username.");
      } else if (res.status === 423) {
        window.alert("Email already Registered");
      } else if (res.status === 201) {
        window.alert("Registration Successful.");
        navigate("/owner-login");
      } else {
        window.alert(res.json);
      }
    } catch (error) {
      window.alert("Error:", error);
    } finally {
      setLoading(false);
    }

  };

  const [owner, setOwner] = useState({
    username: "", password: "", email: "", fullName: "", phoneNumber: ""
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setOwner({ ...owner, [name]: value });
  };

  return (
    <>
      <div class="form-container">
        <h2>Restaurant Owner Registration</h2>
        <form id="signup-form" method='POST' onSubmit={handleRegistration}>
          <div class="form-group">
            <input type="text" id="username" name="username" placeholder='johndoe' required value={owner.username} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <input type="password" id="password" name="password" placeholder='xxxxxxxxx' required value={owner.password} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <input type="email" id="email" name="email" placeholder='johndoe@gmail.com' required value={owner.email} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <input type="text" id="fullName" name="fullName" placeholder='John Doe' required value={owner.fullName} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <input type="tel" id="phoneNumber" name="phoneNumber" placeholder='+91 96x245x35x' required value={owner.phoneNumber} onChange={handleInputs} />
          </div>
          <button type="submit" class="submit-btn button">{loading? "Registering..." : "Register"}</button>
        </form>
        <br />
        <p>Already registered? <Link to="/owner-login">Login here</Link></p>
      </div>
    </>
  )
}

export default Registration;

