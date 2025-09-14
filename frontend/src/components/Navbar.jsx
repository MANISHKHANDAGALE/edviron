import React from 'react';

const Navbar = ({ currentPage, onNavigate, onLogout, token }) => {
  return (
    <nav className="bg-white shadow-md p-4 rounded-xl flex justify-between w-[100%] items-center mb-6">
      <div className="text-2xl font-bold text-gray-800">
        <a href="#" onClick={() => onNavigate('login')}>Eduviron Pay</a>
      </div>
      <div>
        {!token ? (
          <div className="flex space-x-4">
            {currentPage !== 'login' && (
              <button onClick={() => onNavigate('login')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200">
                Login
              </button>
            )}
            {currentPage !== 'register' && (
              <button onClick={() => onNavigate('register')} className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-full transition-colors duration-200">
                Register
              </button>
            )}
          </div>
        ) : (
          <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
