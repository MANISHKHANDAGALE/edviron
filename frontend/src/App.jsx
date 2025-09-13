import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TransactionHistoryPage from './pages/TransactionHistory';
import React from 'react';
function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Check for token on initial load and set page accordingly
  useEffect(() => {
    if (token) {
      setCurrentPage('transactions');
    } else {
      setCurrentPage('login');
    }
  }, [token]);

  const handleLogin = (authToken) => {
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
    setCurrentPage('transactions');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  let content;
  switch (currentPage) {
    case 'login':
      content = <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      break;
    case 'register':
      content = <RegisterPage onNavigate={handleNavigate} />;
      break;
    case 'transactions':
      content = <TransactionHistoryPage token={token} onLogout={handleLogout} />;
      break;
    default:
      content = <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} token={token} />
      {content}
    </div>
  );
}

export default App;
