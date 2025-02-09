import React, { useEffect, useState } from 'react';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/user', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setUserInfo(data.user);
        } else {
          setUserInfo(null);
        }
      })
      .catch(error => console.error('Error checking user status:', error))
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    fetch('http://localhost:8080/logout', { 
      method: 'POST',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        setUserInfo(null);
      } else {
        console.error('Logout failed:', data.message);
      }
    })
    .catch(error => console.error('Logout error:', error));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div id="g_id_onload"
             data-client_id="564507615020-5a6gc9r1qn4sp1qjontrjh214list2bn.apps.googleusercontent.com"
             data-callback="handleCredentialResponse">
        </div>
        <div className="g_id_signin" data-type="standard"></div>
      </div>
    );
  }

  return (
    <div>
      <header style={{
        background: '#f0f0f0', 
        padding: '10px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div>
          <h3 style={{margin: 0}}>Welcome, {userInfo.name}</h3>
          <p style={{margin: '5px 0 0 0'}}>Email: {userInfo.email}</p>
        </div>
        <div>
          <a href="http://localhost:8000/api-docs" target="_blank" rel="noopener noreferrer" style={{marginRight: '20px'}}>
            API Documentation
          </a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
    </div>
  );
}

export default App;
