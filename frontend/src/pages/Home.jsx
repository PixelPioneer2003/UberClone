import React from 'react';
import Uber_logo from '../assets/Uber_logo.png' // Import the image
import { Link } from 'react-router-dom';
// frontend\src\assets\Uber_logo.png
const Home = () => {
  return (
    <div>
      <div className='bg-cover bg-bottom bg-[url(https://media.istockphoto.com/id/1888768110/photo/a-traffic-light-and-flag-of-germany.webp?a=1&b=1&s=612x612&w=0&k=20&c=LbeKmE9vIBJKHWcLgYR2KoBHRUueyH8L6qtQWTmfbTk=)] h-screen pt-5 flex justify-between flex-col w-full bg-red-400'>
        <img  className='w-14 ml-8' src={Uber_logo} alt='Uber_logo' /> 
        <div className='bg-white py-5 px-10'>
          <h2 className='text-2xl font-bold'>Get Started with Uber</h2>
          <Link to='/login'className='inline-block w-full bg-black text-white py-3 rounded mt-4'>Continue</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
