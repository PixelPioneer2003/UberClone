import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CaptainSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [userData, setUserData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    const newCaptain = {
      email: email,
      password: password,
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      licenseNumber: licenseNumber,
    };
    setUserData(newCaptain);
    console.log("Captain Signup:", newCaptain);

    // Clear the form inputs
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setLicenseNumber('');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={submitHandler} className="space-y-6">
          <h3 className="text-2xl font-semibold text-center">Captain Sign Up</h3>

          {/* Name Inputs */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">What is your name?</label>
            <div className="flex gap-4">
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">What is your email?</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Enter Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* License Number Input */}
          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">Enter License Number</label>
            <input
              id="licenseNumber"
              type="text"
              placeholder="License Number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Signup as Captain
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-500">
            <Link to="/captain-login" className="text-blue-600 hover:text-blue-700">
              Login if you already have a Captain account
            </Link>
          </div>
        </form>

        {/* User Signup Link */}
        <div className="text-center mt-4">
          <Link to="/signup" className="text-sm text-blue-600 hover:text-blue-700">
            Sign up as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
