import React, { useState } from 'react';
import axios from '../api/axiosInstance';

const RegisterPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/auth/register', { email, password });
      if (response.status === 201) {
        setMessage('Registration successful! Please login.');
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setError('Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          />
        </div>
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className="text-blue-600 hover:text-blue-800 font-medium">
          Login here
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
