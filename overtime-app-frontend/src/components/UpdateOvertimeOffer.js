import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOvertimeOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState({
    description_id: '',
    date: '',
    start_time: '',
    end_time: '',
    region: '',
    district: '',
    work_location: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/overtime/offer/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOffer(response.data);
      } catch (error) {
        console.error('Failed to fetch overtime offer:', error.message);
      }
    };

    fetchOffer();
  }, [id]);

  const handleChange = (e) => {
    setOffer({ ...offer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      offer.description_id === '' ||
      offer.date === '' ||
      offer.start_time === '' ||
      offer.end_time === '' ||
      offer.region === '' ||
      offer.district === '' ||
      offer.work_location === ''
    ) {
      setError('All fields are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/overtime/update-offer/${id}`, offer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/overtime-offers');
    } catch (error) {
      setError('Failed to update overtime offer: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Update Overtime Offer</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Description ID:
          <input type="text" name="description_id" value={offer.description_id} onChange={handleChange} required />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={offer.date} onChange={handleChange} required />
        </label>
        <label>
          Start Time:
          <input type="time" name="start_time" value={offer.start_time} onChange={handleChange} required />
        </label>
        <label>
          End Time:
          <input type="time" name="end_time" value={offer.end_time} onChange={handleChange} required />
        </label>
        <label>
          Region:
          <input type="text" name="region" value={offer.region} onChange={handleChange} required />
        </label>
        <label>
          District:
          <input type="text" name="district" value={offer.district} onChange={handleChange} required />
        </label>
        <label>
          Work Location:
          <input type="text" name="work_location" value={offer.work_location} onChange={handleChange} required />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateOvertimeOffer;
