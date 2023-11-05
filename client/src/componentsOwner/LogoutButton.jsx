import React from 'react';
import { FaPowerOff } from 'react-icons/fa';
import "../css/logoutButton.css";

const LogoutButton = () => {

    const onLogout = () => {

    }

    return (
        <div className="logout-button" onClick={onLogout}>
            <div className="icon">
                <FaPowerOff />
            </div>
        </div>
    );
};

export default LogoutButton;
