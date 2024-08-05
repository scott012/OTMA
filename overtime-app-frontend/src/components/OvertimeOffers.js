import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './OvertimeOffers.css';
import { UserContext } from '../context/UserContext';

const OvertimeOffers = () => {
  const [offers, setOffers] = useState([]);
  const { user } = useContext(UserContext);
  const [descriptions, setDescriptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {

    // Fetch descriptions
    const fetchDescriptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/overtime-descriptions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDescriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch descriptions:', error);
      }
    };

    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/overtime/offers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(response.data);
      } catch (error) {
        setError('Failed to fetch overtime offers: ' + error.message);
      }
    };

    fetchDescriptions();
    fetchOffers();
  }, []);

  const getDescriptionText = (descriptionId) => {
    const description = descriptions.find(desc => desc.id === descriptionId);
    return description ? description.description : 'Unknown Description';
  };

  return (
    <div>
      <h2>Overtime Offers</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="overtime-offers-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Region</th>
            <th>District</th>
            <th>Work Location</th>
            <th>Instances</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td>{getDescriptionText(offer.description_id)}</td>
              <td>{offer.date}</td>
              <td>{offer.start_time}</td>
              <td>{offer.end_time}</td>
              <td>{!isNaN(offer.duration) ? offer.duration : 'N/A'}</td>
              <td>{offer.region}</td>
              <td>{offer.district}</td>
              <td>{offer.work_location}</td>
              <td>{!isNaN(offer.instances) ? offer.instances : 'N/A'}</td>
              <td>
                <button>Express Interest</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OvertimeOffers;
