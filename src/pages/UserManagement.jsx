import React, { useState, useEffect } from 'react';
import { getUsers, setUsers, getSession } from '../utils/storage';
import { register, logout } from '../utils/auth';
import UserRow from '../components/UserRow';
import { useNavigate } from 'react-router-dom';

/**
 * Admin user management page.
 * - List all users
 * - Create new user (admin/user)
 * - Delete users (except self/admin)
 * - Only accessible to admin
 */
function UserManagement() {
  const navigate = useNavigate();
  const [users, setLocalUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'user',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const session = getSession();
      if (!session || session.role !== 'admin') {
        navigate('/', { replace: true });
        return;
      }
      const loadedUsers = getUsers();
      setLocalUsers(loadedUsers);
      setLoading(false);
    } catch (e) {
      setError('Failed to load users.');
      setLoading(false);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const { username, password, role } = form;
      if (!username.trim() || !password.trim()) {
        setFormError('Username and password are required.');
        setFormLoading(false);
        return;
      }
      if (role !== 'admin' && role !== 'user') {
        setFormError('Role must be admin or user.');
        setFormLoading(false);
        return;
      }
      const currentUsers = getUsers();
      if (currentUsers.some((u) => u.username === username.trim())) {
        setFormError('Username already exists.');
        setFormLoading(false);
        return;
      }
      // Register new user (does not log in as them)
      const result = register(username.trim(), password, role);
      if (!result.success) {
        setFormError(result.error || 'Failed to create user.');
        setFormLoading(false);
        return;
      }
      // After register, session switches to new user, so restore admin session
      const adminSession = getSession();
      if (adminSession && adminSession.role !== 'admin') {
        // Find admin user
        const admins = currentUsers.filter((u) => u.role === 'admin');
        if (admins.length > 0) {
          // Restore admin session
          const adminUser = admins[0];
          localStorage.setItem(
            'session',
            JSON.stringify({
              userId: adminUser.id,
              username: adminUser.username,
              role: adminUser.role,
            })
          );
        }
      }
      setLocalUsers(getUsers());
      setForm({ username: '', password: '', role: 'user' });
    } catch (e) {
      setFormError('Failed to create user.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setLoading(true);
    setError('');
    try {
      const session = getSession();
      const currentUsers = getUsers();
      const user = currentUsers.find((u) => u.id === userId);
      if (!user) {
        setError('User not found.');
        setLoading(false);
        return;
      }
      if (user.role === 'admin') {
        setError('Cannot delete admin user.');
        setLoading(false);
        return;
      }
      if (session && session.userId === userId) {
        // Deleting self: log out and redirect
        const updatedUsers = currentUsers.filter((u) => u.id !== userId);
        setUsers(updatedUsers);
        logout();
        navigate('/login', { replace: true });
        return;
      }
      const updatedUsers = currentUsers.filter((u) => u.id !== userId);
      setUsers(updatedUsers);
      setLocalUsers(updatedUsers);
      setLoading(false);
    } catch (e) {
      setError('Failed to delete user.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-500 text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">User Management</h2>
      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}
      <form onSubmit={handleCreateUser} className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleInputChange}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 md:mb-0"
            disabled={formLoading}
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 md:mb-0"
            disabled={formLoading}
            autoComplete="new-password"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={formLoading}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {formError && (
          <div className="text-red-500 text-sm font-medium">{formError}</div>
        )}
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            formLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          disabled={formLoading}
        >
          {formLoading ? 'Creating...' : 'Create User'}
        </button>
      </form>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">All Users</h3>
        {users.length === 0 ? (
          <div className="text-gray-500">No users found.</div>
        ) : (
          users.map((user) => (
            <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />
          ))
        )}
      </div>
    </div>
  );
}

export default UserManagement;