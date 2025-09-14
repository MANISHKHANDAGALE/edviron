import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import TransactionTable from '../components/TransactionTable';

const TransactionHistoryPage = ({ token, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // new filters
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/transactions');
        const data = response.data;

        if (data.results && Array.isArray(data.results)) {
          setTransactions(data.results);
        } else {
          console.error('API response does not contain a valid "results" array:', data);
          setError('Invalid data format received from the server.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching data.');
        console.error('Fetch error:', err);
        if (err.response?.status === 401) {
          onLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [token, onLogout]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-full lg:max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">History</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200">
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search (Order ID...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />

        {/* Date Filter */}
        {/* <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        /> */}

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>

        {/* School Filter */}
        <select
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Schools</option>
          <option value="65b0e6293e9f76a9694d84b4">65b0e6293e9f76a9694d84b4</option>
          {/* Add more schools dynamically if needed */}
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading transactions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <TransactionTable
          transactions={transactions}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          schoolFilter={schoolFilter}
        />
      )}
    </div>
  );
};

export default TransactionHistoryPage;
