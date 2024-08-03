import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [continuousServiceDate, setContinuousServiceDate] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [roles] = useState(['employee', 'admin']); // Example roles
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch work locations
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/work-locations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLocations(response.data);

        // Default to admin user's work location
        if (user) {
          const adminLocation = response.data.find(location =>
            location.region === user.region &&
            location.district === user.district &&
            location.work_location === user.work_location
          );
          if (adminLocation) {
            setRegion(adminLocation.region);
            setDistrict(adminLocation.district);
            setWorkLocation(adminLocation.work_location);
          }
        }
      } catch (error) {
        console.error('Failed to fetch work locations:', error);
      }
    };

    fetchLocations();
  }, [user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        username,
        password,
        email,
        role,
        continuous_service_date: continuousServiceDate,
        region,
        district,
        work_location: workLocation,
      });
      // Handle successful registration
    } catch (error) {
      // Handle registration error
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="" disabled>Select Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Continuous Service Date"
          value={continuousServiceDate}
          onChange={(e) => setContinuousServiceDate(e.target.value)}
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="" disabled>Select Region</option>
          {locations.map((location, index) => (
            <option key={index} value={location.region}>{location.region}</option>
          ))}
        </select>
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="" disabled>Select District</option>
          {locations.filter(location => location.region === region).map((location, index) => (
            <option key={index} value={location.district}>{location.district}</option>
          ))}
        </select>
        <select value={workLocation} onChange={(e) => setWorkLocation(e.target.value)}>
          <option value="" disabled>Select Work Location</option>
          {locations.filter(location => location.region === region && location.district === district).map((location, index) => (
            <option key={index} value={location.work_location}>{location.work_location}</option>
          ))}
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
