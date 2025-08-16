import React from "react";
import './Navbar.css';
import userProfile from './images/userProfile.svg';
import logo from './images/logo.svg';

const Navbar = () => {
    return (
        <header className="header">
            <h1 className="header_title">
                <img src={logo} alt="Logo" className="header_logo" /> Task Master AI
            </h1>
         
            <div className="header_user">
                <img src={userProfile} alt="User Profile" className="header_user-icon" />
            </div>
        </header>
    );
    }

export default Navbar;