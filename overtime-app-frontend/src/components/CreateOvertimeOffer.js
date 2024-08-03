import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const CreateOvertimeOffer = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [instances, setInstances] = useState(1);
  const [locations, setLocations] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch work locations and descriptions
    const fetchData = async () => {
      try {
        const locationsResponse = await axios.get('http://localhost:5000/api/work-locations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLocations(locationsResponse.data);

        const descriptionsResponse = await axios.get('http://localhost:5000/api/overtime-descriptions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDescriptions(descriptionsResponse.data);

        // Default to admin user's work location
        if (user) {
          const adminLocation = locationsResponse.data.find(location =>
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
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/overtime/create', {
        description,
        date,
        start_time: startTime,
        end_time: endTime,
        region,
        district,
        work_location: workLocation,
        instances,
      });
      // Handle successful offer creation
    } catch (error) {
      console.error('Error creating overtime offer:', error);
    }
  };

  return (
    <div>
      <h2>Create Overtime Offer</h2>
      <form onSubmit={handleSubmit}>
        <select value={description} onChange={(e) => setDescription(e.target.value)}>
          <option value="" disabled>Select Description</option>
          {descriptions.map((desc, index) => (
            <option key={index} value={desc}>{desc}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
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
        <input
          type="number"
          min="1"
          value={instances}
          onChange={(e) => setInstances(e.target.value)}
        />
        <button type="submit">Create Offer</button>
      </form>
    </div>
  );
};

export default CreateOvertimeOffer;
