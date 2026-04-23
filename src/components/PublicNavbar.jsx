import React from 'react';
import { getSession, clearSession } from '../utils/storage';
import { logout } from '../utils/auth';

function PublicNavbar() {
  const [session, setSession] = React.useState(getSession());

  React.useEffect(() => {
    function handleStorage() {
      setSession(getSession());
    }
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setSession(null);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">writespace</span>
      </div>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span className="text-gray-700 font-medium">
              Hello, {session.username}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition text-sm font-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="px-4 py-2 text-blue-600 font-semibold hover:underline text-sm"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
            >
              Get Started
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;