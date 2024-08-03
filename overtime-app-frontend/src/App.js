// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ModifyEmployee from './components/ModifyEmployee';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import EmployeeList from './components/EmployeeList';
import OvertimeOffers from './components/OvertimeOffers';
import Register from './components/Register';
import CreateOvertimeOffer from './components/CreateOvertimeOffer';
import Dashboard from './components/Dashboard'; // Import Dashboard

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/modify-employee/:id" element={<ProtectedRoute component={ModifyEmployee} />} />
          <Route path="/employees" element={<ProtectedRoute component={EmployeeList} />} />
          <Route path="/overtime-offers" element={<ProtectedRoute component={OvertimeOffers} />} />
          <Route path="/register" element={<ProtectedRoute component={Register} />} />
          <Route path="/create-overtime-offer" element={<ProtectedRoute component={CreateOvertimeOffer} />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
