import React, { useEffect, useState } from 'react';
import "../css/ownerHome.css";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import "../css/logoutButton.css";
import LogoutButton from '../componentsOwner/LogoutButton';
import Edit from '../componentsOwner/Edit';


const Owner = () => {

  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
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
          throw error;
        }

    } catch (error) {
        console.log(error);
        navigate("/owner-login");
    }
  }

  useEffect(() => {
    callHomePage();
  },);

  const handleEditButton = (e) => {
    e.preventDefault();
    if (userData) {
      setShowEdit(true);
    } else {
      navigate("/owner-login");
    }
  };

  const handleAddButton = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("/add-restaurant", {
          method: "GET",
          credentials: "include", 
        });
        
        if(res.status === 401){
          window.alert("Unauthorized User.")
          navigate("/owner-login");
        }else{
          navigate("/add-restaurant");
        }
    } catch (error) {
      
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    if(userData){
        fetch('/owner-logout',{
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include"
        }).then((res) =>{
          if(res.status === 200){
            window.alert("Logged Out Successfully.");  
            navigate("/owner-login");
          }else{
            const err = new Error(res.err);
            console.log(err);
          }
      }).catch((err) =>{
        console.log(err);
      })
    }else{
      console.log("Error Found.");
    }
  };

  if(userData){
    return (
      <>
        <form method='GET' className="container">
          <div className="items">
            <div className="subItems">
              <div className="icon"><FaHouseUser/></div>
              <div className="content"><h3>{userData.username}</h3></div>
            </div>
            <div className="subItems">
              <div className="icon"><RiLockPasswordFill/></div>
              <div className="content"><h3>xxxxxx</h3></div>
            </div>
            <div className="subItems">
              <div className="icon"><MdEmail/></div>
              <div className="content"><h3>{userData.email}</h3></div>
            </div>
            <div className="subItems">
              <div className="icon"><FaUser/></div>
              <div className="content"><h3>{userData.fullName}</h3></div>
            </div>
            <div className="subItems">
              <div className="icon"><BsFillTelephoneInboundFill/></div>
              <div className="content"><h3>{userData.phoneNumber}</h3></div>
            </div>
          </div>
          <div className='editIcon' title='Edit Details' onClick={handleEditButton}><AiTwotoneEdit/></div>
          {showEdit && <Edit data = {userData} onClose={() => setShowEdit(false)} />}
        </form>
        <div className="editIcon" title='Add Restaurant' onClick={handleAddButton}><BiSolidMessageSquareAdd/></div>
        <div className="logout-button-container" title='Log Out' onClick={handleLogout}>
          <LogoutButton />
        </div>
      </>
    )
  }else{
    return (
      <>
        <div className="container">
              <div className="subItems">
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
