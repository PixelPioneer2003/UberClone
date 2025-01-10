import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { captain, updateCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchCaptainData = async () => {
      if (!token) {
        navigate('/captain-login');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          updateCaptain(response.data.captain);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching captain data:', error);
        localStorage.removeItem('token');
        navigate('/captain-login');
      } 
    };

    fetchCaptainData();
  }, [token]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
