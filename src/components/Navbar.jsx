import React from 'react';
import PropTypes from 'prop-types';
import { getSession, clearSession } from '../utils/storage';
import { logout } from '../utils/auth';
import { getAvatar } from './Avatar';

function Navbar({ onLogout }) {
  const session = getSession();

  const handleLogout = () => {
    logout();
    if (typeof onLogout === 'function') {
      onLogout();
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-bold text-blue-600 select-none">WriteSpace</span>
        {session && (
          <span className="flex items-center">
            {getAvatar(session.role)}
            <span className="text-sm font-medium text-gray-700">{session.username}</span>
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <a
              href="/dashboard"
              className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition"
            >
              Dashboard
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onLogout: PropTypes.func,
};

export default Navbar;