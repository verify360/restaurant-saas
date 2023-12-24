import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../css/signin.css';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword} from 'firebase/auth'

export default function Signin({ onClose}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      onClose(); 
      navigate(currentPath);
    } catch (error) {
      // If user does not exist, attempt to create a new account
      if (error.code === 'auth/invalid-login-credentials') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          alert('Account created successfully!');
          onClose();
          navigate(currentPath);
        } catch (signupError) {
          alert("Please Enter a Valid Password.");
        }
      } else {
        alert("Please Enter Valid Credentials.");
      }
    }
  };


  return (
    <div className="overlay show-overlay">
      <div className="modal">
      <h2>Signin/Signup</h2>
      <form onSubmit={(e) => { handleSignin(e);}}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className='subLogin button' type="submit">Login</button>
          <span><button className='close button' onClick={onClose}>Close</button></span>
        </form>
      </div>
    </div>
  );
}
