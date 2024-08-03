import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        setError('Failed to fetch dashboard data: ' + error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <p>Welcome, {userData.first_name} {userData.last_name}</p>
      <p>Role: {userData.role}</p>
      <p>Region: {userData.region}</p>
      <p>District: {userData.district}</p>
      <p>Work Location: {userData.work_location}</p>
    </div>
  );
};

export default Dashboard;
