import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './CreateOvertimeOffer.css';

const CreateOvertimeOffer = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [respondBy, setRespondBy] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [instances, setInstances] = useState(1);
  const [locations, setLocations] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
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
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
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
        respond_by: respondBy,
        region,
        district,
        work_location: workLocation,
        instances,
      });
      alert('Overtime offer created successfully');
    } catch (error) {
      console.error('Error creating overtime offer:', error);
      setError('Error creating overtime offer. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="create-overtime-offer">
      <h2>Create Overtime Offer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <select value={description} onChange={(e) => setDescription(e.target.value)}>
            <option value="" disabled>Select Description</option>
            {descriptions.map((desc, index) => (
              <option key={index} value={desc.id}>{desc.description}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        
        <div>
          <label>Region:</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="" disabled>Select Region</option>
            {locations.map((location, index) => (
              <option key={index} value={location.region}>{location.region}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>District:</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="" disabled>Select District</option>
            {locations.filter(location => location.region === region).map((location, index) => (
              <option key={index} value={location.district}>{location.district}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Work Location:</label>
          <select value={workLocation} onChange={(e) => setWorkLocation(e.target.value)}>
            <option value="" disabled>Select Work Location</option>
            {locations.filter(location => location.region === region && location.district === district).map((location, index) => (
              <option key={index} value={location.work_location}>{location.work_location}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Instances:</label>
          <input
            type="number"
            min="1"
            value={instances}
            onChange={(e) => setInstances(e.target.value)}
          />
        </div>
        
        <div>
          <label>Respond By:</label>
          <input
            type="datetime-local"
            value={respondBy}
            onChange={(e) => setRespondBy(e.target.value)}
          />
        </div>
        
        <div style={{ flex: '0 0 100%' }}>
          <button type="submit">Create Offer</button>
        </div>
      </form>
    </div>
  );
};

export default CreateOvertimeOffer;
