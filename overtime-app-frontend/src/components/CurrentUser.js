import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CurrentUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user details: ' + error.message);
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      {user && (
        <div style={{ textAlign: 'right', padding: '10px' }}>
          Current User: {user.first_name} {user.last_name}
        </div>
      )}
    </div>
  );
};

export default CurrentUser;
