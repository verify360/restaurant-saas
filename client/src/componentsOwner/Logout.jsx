import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const navigate = useNavigate

    useEffect(() => {
        fetch('/owner-logout', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
        })
        .then((res) => {
            window.alert('Logged Out Successfully.');
            navigate('/owner-login',{replace: true});
        })
        .catch((err) => {
            console.log(err);
        });
      });

  return (
    <>
      
    </>
  )
}

export default Logout
