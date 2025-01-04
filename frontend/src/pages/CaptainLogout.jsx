import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const CaptainLogout = () => {
   const navigate = useNavigate();

    useEffect(() => {
        console.log('Captain Logout');
        const token = localStorage.getItem('token');
        console.log(token);
        // Make the API call for logout
     axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    console.log('Captain logged out');
                    localStorage.removeItem('token');
                    navigate('/captain-login');
                }
            })
            .catch((error) => {
                console.error('Error during logout:', error);
                // Optionally handle errors
            });
    }, []); // Dependency array ensures it runs only once on mount

    return <div>CaptainLogout</div>;
}


export default CaptainLogout