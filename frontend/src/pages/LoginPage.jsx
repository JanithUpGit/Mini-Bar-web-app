import React, { useState } from 'react';
import {backgroundimage} from '../../assets/images/Login_Register_BG.png';
import { authAPI } from '../services/api';
import Navbar from '../components/loginNav';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setMessage('Loading...');
  setIsError(false);

  try {
    console.log(email,password);
    const response = await authAPI.login({ email, password });
    
    if (response.status === 200) {
      // Login සාර්ථක නම්
      setMessage('සාර්ථකව ප්‍රවේශ විය! 🎉');
      setIsError(false);
      navigate("/");
    } else {
      // මෙය ප්‍රධාන වශයෙන් අවශ්‍ය නැත
      setMessage(response.data.error || 'Login failed. Please check your credentials.');
      setIsError(true);
    }
  } catch (error) {
    // 400 දෝෂයක් වැනි අසාර්ථක ප්‍රතිචාර මෙහිදී හසුවෙයි.
    // backend එකෙන් ලැබෙන නිවැරදි දෝෂ පණිවිඩය පෙන්වයි.
    setMessage(error.response?.data?.error || 'Login failed. Please check your credentials.');
    setIsError(true);
    console.error('Login error:', error);
  }
};

  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Navbar/>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        {message && (
          <div className={`mt-4 font-bold ${isError ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
