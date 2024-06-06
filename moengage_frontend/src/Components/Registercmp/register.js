
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', { username, password });
      navigate('/login');
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Signup Error:', error);
    }
  };

  return (
    <div className="Register">
      <h1>Register Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Signup</button>
        <h3>or</h3>
        <button onClick={() => navigate('/login')}>Login</button>
      </form>
      

      
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Signup;
