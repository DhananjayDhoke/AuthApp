
import { useState, useEffect } from 'react';
import axios from 'axios';
import {Register} from './components/register';

const BASE_URL = 'http://localhost:8088/api';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/login`, { email, password });

      setToken(data.token);
      setRefreshToken(data.refreshToken);

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken('');
    setRefreshToken('');

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const handleProfile = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        try {
          const { data } = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });

          setToken(data.token);
          setRefreshToken(data.refreshToken);

          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
        } catch (err) {
          console.error(err);
          handleLogout();
        }
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <Register></Register>
      <h1>JWT Authentication</h1>

      {token ? (
        <div>
          <button onClick={handleProfile}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )
       : (
        <div>
          <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      )};
    </div>
);
};

export default App;    
