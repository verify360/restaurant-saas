import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CiLocationOn } from 'react-icons/ci';
import logo from '../assets/logo.png';
import foodIcon from '../assets/food.png';
import Signin from './Signin';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import cities from '../allCities';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';
import Signup from './Signup';

function Navbar({ city, onSelectCity, onCityChangeRedirect }) {
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/user-info?userEmail=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setUserDetails(data);
        } else {
          // console.error('Failed to fetch user details');
        }
      } catch (error) {
        // console.error('Error fetching user details:', error);
      }
    };

    const handlePostUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: user.displayName,
            userEmail: user.email,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          }),
        });
      } catch (error) {
        // console.log(error);
      }
    };

    if (user) {
      fetchUserDetails();

      if (userDetails === null) {
        handlePostUser();
      }
    }
  }, [user, userDetails]);

  const toggleDropdown = () => {
    setFilteredCities(filteredCities.length ? [] : cities);
    setShowKey(!showKey);
  };

  const links = [
    { name: 'Home', link: '/' },
    { name: 'Book a Table', link: `/${city}-restaurants` },
    { name: 'Blog', link: '/blog' },
  ];

  const handleCitySearch = (searchTerm) => {
    const filtered = cities.filter((city) =>
      city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleCitySelect = (selectedCity) => {
    setSearchTerm('');
    setFilteredCities([]);
    onSelectCity(selectedCity);
    onCityChangeRedirect(selectedCity);
    setShowKey(false);
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
      <div className='navBar-main'>
        <div className='navbar-main--item'>
          <div>
            <span> +011 234 567 89 |</span>
            <span> contact@domain.com</span>
          </div>
          <span>My Account</span>
        </div>
      </div>
      <nav className='navBar-inner flex'>
        <div className='flex flex-item logo'>
          <img
            src={foodIcon}
            alt='Taste&Flavor'
            style={{ height: '52px', width: '52px', borderRadius:'2.5rem' }}
          />
          <span style={{color:'#00635A', fontSize:'2.5rem', paddingLeft:'0.6rem'}}>𝑻𝒂𝒔𝒕𝒆&𝑭𝒍𝒂𝒗𝒐𝒓</span>
        </div>
        <div className='flex-item dropdownMenu'>
          <span>
            <CiLocationOn className='locationIcon' />
          </span>
          <input
            type='text'
            placeholder={showKey ? 'Search City..' : capitalizeWords(city)}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleCitySearch(e.target.value);
            }}
            onFocus={() => searchTerm === '' && setFilteredCities(cities)}
            onClick={() => setShowKey(true)}
            className='searchInput'
          />
          {filteredCities && (
            <ul className='citySuggestions'>
              {filteredCities.map((city) => (
                <li
                  key={city.cityName}
                  onClick={() => handleCitySelect(city.cityName)}
                >
                  {city.cityName}
                </li>
              ))}
            </ul>
          )}
          {!showKey ? (
            <FaCaretDown
              onClick={() => toggleDropdown()}
              className='locationIcon showKey'
            />
          ) : (
            <FaCaretUp
              onClick={() => toggleDropdown()}
              className='locationIcon showKey'
            />
          )}
        </div>
        <div className='flex-item'>
          <ul className='flex links'>
            {links.map(({ name, link }) => {
              return (
                <li key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              );
            })}
            {user && (
              <li key='History'>
                <Link to='/history'>Profile</Link>
              </li>
            )}
          </ul>
        </div>
        <div className='flex-item login'>
          <button onClick={handleLoginButtonClick} className='loginButton'>
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>
      {showLogin && (
        <Signin
          onClose={() => setShowLogin(false)}
          handleSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}
      {showSignUp && (
        <Signup
          onClose={() => setShowSignUp(false)}
          handleSignIn={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default Navbar;
