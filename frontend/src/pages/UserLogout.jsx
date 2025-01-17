import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('UserLogout');
        const token = localStorage.getItem('token');
        console.log(token);
        // Make the API call for logout
     axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    console.log('User logged out');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
            .catch((error) => {
                console.error('Error during logout:', error);
                // Optionally handle errors
            });
    }, []); // Dependency array ensures it runs only once on mount

    return <div>UserLogout</div>;
};

export default UserLogout;
