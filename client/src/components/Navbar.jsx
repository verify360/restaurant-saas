import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import logo from "../assets/logo.png";
import Signin from "./Signin";
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function Navbar() {
  const links = [
    { name: "Home", link: "/" },
    { name: "Book a Table", link: "/book-a-table" },
    { name: "Blog", link: "/blog" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const options = ["Shovabazar, Kolkata", "Other"];
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showLogin, setShowLogin] = useState(false);
  const [user] = useAuthState(auth);

  const handleLoginButtonClick = () => {
    if (user) {
      auth.signOut();
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      <nav className="navBar flex">
        <div className="flex-item logo">
          <img src={logo} alt="Taste&Flavor" />
        </div>
        <div className="flex-item dropdownMenu">
          <span>
            <CiLocationOn className="locationIcon" />
          </span>
          <input
            type="text"
            placeholder="Search location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="searchInput"
          />
          <select name="location" id="location" className="locationSelect">
            {filteredOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-item">
          <ul className="flex links">
            {links.map(({ name, link }) => {
              return (
                <li key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex-item login">
          <button onClick={handleLoginButtonClick} className="loginButton">
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>
      {showLogin && <Signin onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Navbar;
