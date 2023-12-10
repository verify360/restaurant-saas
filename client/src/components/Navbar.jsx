import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import logo from "../assets/logo.png";
import Signin from "./Signin";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import cities from "../allCities";

function Navbar({ city, onSelectCity, onCityChangeRedirect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const [user] = useAuthState(auth);

  const links = [
    { name: "Home", link: "/" },
    { name: "Book a Table", link: `/${city}-restaurants` },
    { name: "Blog", link: "/blog" },
  ];

  const handleCitySearch = (searchTerm) => {
    const filtered = cities.filter(city => city.cityName.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredCities(filtered);
  };

  const handleCitySelect = (selectedCity) => {
    setSearchTerm("");
    setFilteredCities([]);
    onSelectCity(selectedCity);
    onCityChangeRedirect(selectedCity);
  };

  const handleLoginButtonClick = () => {
    if (user) {
      auth.signOut();
    } else {
      setShowLogin(true);
    }
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
            placeholder={city ? capitalizeWords(city) : "Search City.."}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleCitySearch(e.target.value);
            }}
            onFocus={() => searchTerm === '' && setFilteredCities(cities)}
            className="searchInput"
          />
          {filteredCities && (
            <ul className="citySuggestions">
              {filteredCities.map((city) => (
                <li key={city.cityName} onClick={() => handleCitySelect(city.cityName)}>
                  {city.cityName}
                </li>
              ))}
            </ul>
          )}
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
            {user && (
              <li key="History">
                <Link to="/history">History</Link>
              </li>
            )}
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
