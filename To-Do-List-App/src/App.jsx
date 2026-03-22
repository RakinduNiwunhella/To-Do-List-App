import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar.jsx';
import ToDoList from './ToDoList';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (accessToken) => {
    // Fetch user profile from Google
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const profile = await res.json();
    setUser(profile);
    localStorage.setItem('google_access_token', accessToken);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('google_access_token');
  };

  // Restore session on page reload (optional)
  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    if (token) handleLogin(token);
  }, []);

  return (
    <>
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      {user ? <ToDoList /> : (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <p>Please sign in with Google to use the app.</p>
        </div>
      )}
    </>
  );
}

export default App;