import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/config';
import { User } from '../types';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Custom hook for maintaining login session after refresh.
 */
const useFakeStackOverflow = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async (): Promise<void> => {
      try {
        const res = await api.get(`${USER_API_URL}/getCurrentUser`);
        if (res.status === 200) {
          setUser(res.data);
          if (window.location.pathname === '/' || window.location.pathname === '/register') {
            navigate('/home');
          }
        }
      } catch (err) {
        setUser(null);
        navigate('/');
      }
    };
    getCurrentUser();
  }, [navigate]);
  return { user, setUser };
};

export default useFakeStackOverflow;
