import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
  const location = useLocation();
  const role = location.state.role;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      // Send a POST request to your backend server for authentication
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
       
      });
      console.log(response.data)
      // Check if login was successful
      if (response.data.success) {
        // Redirect based on the role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'patient') {
          navigate('/patient');
        } else if (role === 'doctor') {
          navigate('/doctor');
        }
      } else {
        // Handle login failure (e.g., invalid credentials)
        alert(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login Page</h1>
        <h4 className="login-role">Welcome {role}</h4>
        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
