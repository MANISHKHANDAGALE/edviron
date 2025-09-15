import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ token, onLogout }) => {
  return (
    <nav className="bg-white shadow-md p-4 rounded-xl flex justify-between w-full items-center mb-6">
      <div className="text-2xl font-bold text-gray-800">
        <NavLink to="/">Edviron</NavLink>
      </div>
      <div>
        {!token ? (
          <div className="flex space-x-4">
            <NavLink
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-full transition-colors duration-200"
            >
              Register
            </NavLink>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
