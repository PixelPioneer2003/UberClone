import React, { useState,useContext } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { userDataContext } from '../context/userContext'; // Import the context
import axios from 'axios';
const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});
    const { user, setUser } = useContext(userDataContext); // Use the context here
    const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const userData={ email: email, password: password };
    console.log(email, password);
     try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );
      if (response.status === 200) {
        console.log(response.data);
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
    }
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={submitHandler} className="space-y-6">
          <h3 className="text-2xl font-semibold text-center">Login</h3>

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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-500">
            <Link to="/signup" className="text-blue-600 hover:text-blue-700">Create New Account</Link>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/captain-login" className="text-sm text-blue-600 hover:text-blue-700">Sign in as Captain</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
