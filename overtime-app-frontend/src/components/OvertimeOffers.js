import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OvertimeOffers.css';

const OvertimeOffers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchOffers();
  }, []);

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
              <td>{offer.description_id}</td>
              <td>{new Date(offer.date).toLocaleDateString()}</td>
              <td>{offer.start_time}</td>
              <td>{offer.end_time}</td>
              <td>{(new Date(`1970-01-01T${offer.end_time}Z`) - new Date(`1970-01-01T${offer.start_time}Z`)) / (1000 * 60 * 60)}</td>
              <td>{offer.region}</td>
              <td>{offer.district}</td>
              <td>{offer.work_location}</td>
              <td>{offer.instances}</td>
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
