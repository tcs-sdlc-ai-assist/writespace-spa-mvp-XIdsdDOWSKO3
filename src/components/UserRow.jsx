import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar.jsx';
import { getSession } from '../utils/storage.js';
import { logout } from '../utils/auth.js';

function UserRow({ user, onDelete }) {
  const session = getSession();
  const isAdmin = user.role === 'admin';
  const isSelf = session && session.userId === user.id;
  const disableDelete = isAdmin || isSelf;

  const handleDelete = () => {
    if (disableDelete) return;
    onDelete(user.id);
    // If deleting self, log out
    if (isSelf) {
      logout();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md shadow-sm mb-2">
      <div className="flex items-center space-x-2">
        {getAvatar(user.role)}
        <span className="font-semibold text-gray-800">{user.username}</span>
        <span className="text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">{user.role}</span>
      </div>
      <button
        className={`px-3 py-1 text-sm rounded transition ${
          disableDelete
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-500 text-white hover:bg-red-600'
        }`}
        onClick={handleDelete}
        disabled={disableDelete}
        aria-disabled={disableDelete}
        aria-label={`Delete user ${user.username}`}
      >
        Delete
      </button>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    password: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;