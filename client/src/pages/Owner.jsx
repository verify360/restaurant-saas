import React, { useEffect, useState } from 'react';
import "../css/ownerHome.css";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import "../css/logoutButton.css";
import LogoutButton from '../componentsOwner/LogoutButton';


const Owner = () => {

  const navigate = useNavigate();
  const [userData,setUserData] = useState(null);

  const callHomePage = async () => {
    try {
        const res = await fetch("/owner-home", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include", 
        }); 

        const data = await res.json();
        // console.log(data);
        setUserData(data);

        if(!res.status === 200){
          const error = new Error(res.error);
          throw error
        }

    } catch (error) {
        console.log(error);
        navigate("/owner-login");
    }
  }

  useEffect(() => {
    callHomePage();
  },);

  const handleEdit = () => {
    
  }

  if(userData){
    return (
      <>
        <form method='GET' className="container">
          <div className="items">
            <div className="icon"><FaHouseUser/></div>
            <div className="content"><h3>{userData.username}</h3></div>
          </div>
          <div className="items">
            <div className="icon"><RiLockPasswordFill/></div>
            <div className="content"><h3>xxxxxx</h3></div>
          </div>
          <div className="items">
            <div className="icon"><MdEmail/></div>
            <div className="content"><h3>{userData.email}</h3></div>
          </div>
          <div className="items">
            <div className="icon"><FaUser/></div>
            <div className="content"><h3>{userData.fullName}</h3></div>
          </div>
          <div className="items">
            <div className="icon"><BsFillTelephoneInboundFill/></div>
            <div className="content"><h3>{userData.phoneNumber}</h3></div>
          </div>
          <div className='editIcon' onClick={handleEdit}><AiTwotoneEdit/></div>
        </form>
        <div className="logout-button-container">
          <LogoutButton />
        </div>
      </>
    )
  }else{
    return (
      <>
        <div className="container">
              <div className="items">
                <div className="icon"><FaSearch/></div>
                <div className="content"><h3>Page Loading...</h3></div>
              </div>
              <Link to="/" className=" icon"><AiFillHome/></Link>
        </div>
      </>
    )
  }
}

export default Owner;
