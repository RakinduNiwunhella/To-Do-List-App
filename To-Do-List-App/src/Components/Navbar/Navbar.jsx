import React from "react";
import { useGoogleLogin } from '@react-oauth/google';
import './Navbar.css';
import logo from './images/logo.svg';

const Navbar = ({ user, onLogin, onLogout }) => {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => onLogin(tokenResponse.access_token),
        onError: () => console.error('Google login failed'),
    });

    return (
        <header className="header">
            <div className="header_brand">
                <div className="header_logo-wrap">
                    <img src={logo} alt="Logo" className="header_logo" />
                </div>
                <span className="header_title">
                    Task Master <span className="header_title-ai">AI</span>
                </span>
            </div>
            <div className="header_actions">
                {user ? (
                    <div className="user-info">
                        <img src={user.picture} alt={user.name} className="user-avatar" />
                        <span className="user-name">{user.name}</span>
                        <button className="google-login-btn" onClick={onLogout}>Sign out</button>
                    </div>
                ) : (
                    <button className="google-login-btn" onClick={() => login()}>
                        {/* keep your existing SVG here */}
                        Sign in with Google
                    </button>
                )}
            </div>
        </header>
    );
}

export default Navbar;