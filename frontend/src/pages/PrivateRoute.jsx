import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const AuthGuard = ({ children }) => {
  const { token } = useContext(UserContext);
  console.log("Stored Token in UserContextProvider:", token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
