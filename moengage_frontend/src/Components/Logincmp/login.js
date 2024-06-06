
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    

    axios.post('http://localhost:5000/login', { username, password })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        navigate('/search');
      })
      .catch(error => {
        if (error.response) {
          
          console.error('Server Error:', error.response.data);
        } else if (error.request) {
          
          console.error('No Response:', error.request);
        } else {
         
          console.error('Request Setup Error:', error.message);
        }
       
      });
  };

  return (
    <div className="login">
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        <h3>or</h3>
        <button onClick={() => navigate('/')}>Register</button>
      </form>
    </div>
  );
}

export default Login;
