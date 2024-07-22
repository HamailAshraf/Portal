import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export const useTokenHandler = () => {
  const { setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleTokenExpiration = (error) => {
    if (error.response && error.response.status === 401) {
      setToken(null);
      localStorage.removeItem('token');
      navigate('/');
    } else {
      console.error('An error occurred:', error);
    }
  };

  return { handleTokenExpiration};
};
