import React, { useState, useContext } from 'react'; // Add useContext here
import { Link, useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext'; // Import the context
import axios from 'axios';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const navigate = useNavigate();
  const { user, setUser } = useContext(userDataContext); // Use the context here

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      password: password,
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );
      if (response.status === 201) {
        console.log(response.data);
        const data = response.data;
        setUser(data.user);
                localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
    }

    // Clear the form inputs
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={submitHandler} className="space-y-6">
          <h3 className="text-2xl font-semibold text-center">Sign Up</h3>

          {/* Name Inputs */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              What is your name?
            </label>
            <div className="flex gap-4">
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              What is your email?
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Enter Password
            </label>
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

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Signup
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Login if you already have an account
            </Link>
          </div>
        </form>

        {/* Captain Signup Link */}
        <div className="text-center mt-4">
          <Link to="/captain-signup" className="text-sm text-blue-600 hover:text-blue-700">
            Sign up as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
