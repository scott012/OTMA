import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(response.data);
      } catch (error) {
        setError('Failed to fetch employees: ' + error.message);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {employees.length === 0 ? (
        <p>No employees available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Continuous Service Date</th>
              <th>Region</th>
              <th>District</th>
              <th>Work Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.user_id}>
                <td>{employee.user_id}</td>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
                <td>{employee.continuous_service_date}</td>
                <td>{employee.region}</td>
                <td>{employee.district}</td>
                <td>{employee.work_location}</td>
                <td>
                  <Link to={`/modify-employee/${employee.user_id}`}>Modify</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
