import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useContext(UserContext);

  return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
