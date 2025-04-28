import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const Loginpage = () => {
  const [mockData, setMockData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json()) 
      .then((data) => setMockData(data))   
      .catch((error) => console.error("Error fetching data:", error)); 
  }, []); 

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // store the logged-in email
        localStorage.setItem("userEmail", email);
        navigate("/calendar");
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error during login');
    }
  };
  

  return (
    <div className="auth-container">
      <h2>LOG IN</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Log In</button>
        </div>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Loginpage;

