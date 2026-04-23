import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, getUsers, getPosts, setPosts } from '../utils/storage';
import { logout, requireRole } from '../utils/auth';
import StatCard from '../components/StatCard';
import BlogCard from '../components/BlogCard';

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPostsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const sess = getSession();
      if (!sess) {
        setError('You must be logged in as admin.');
        setLoading(false);
        return;
      }
      requireRole('admin');
      setSession(sess);
      setUsers(getUsers());
      setPostsState(getPosts());
      setLoading(false);
    } catch (e) {
      setError('Access denied. Admin only.');
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleWriteBlog = () => {
    navigate('/write');
  };

  const handleEditPost = (post) => {
    navigate(`/edit/${post.id}`);
  };

  const handleDeletePost = (post) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const updatedPosts = posts.filter((p) => p.id !== post.id);
      setPosts(updatedPosts);
      setPostsState(updatedPosts);
    } catch (e) {
      setError('Failed to delete post.');
    }
  };

  const handleManageUsers = () => {
    navigate('/dashboard');
  };

  // Stats
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  // Recent posts (sorted by createdAt desc)
  const recentPosts = [...posts]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-500 text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-xl font-semibold mb-2">{error}</div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md mb-8">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-blue-600 select-none">Admin Dashboard</span>
          {session && (
            <span className="text-sm font-medium text-gray-700">({session.username})</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition"
            onClick={handleWriteBlog}
          >
            Write Blog
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition"
            onClick={handleManageUsers}
          >
            Manage Users
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard count={totalUsers} label="Total Users" icon={<span>👥</span>} />
          <StatCard count={adminCount} label="Admins" icon={<span>👑</span>} />
          <StatCard count={userCount} label="Writers" icon={<span>📚</span>} />
          <StatCard count={totalPosts} label="Total Posts" icon={<span>📝</span>} />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h2>
          {recentPosts.length === 0 ? (
            <div className="text-gray-500">No posts found.</div>
          ) : (
            recentPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={{
                  ...post,
                  authorName: post.authorUsername || 'Unknown',
                  authorRole: users.find((u) => u.id === post.authorId)?.role || 'user',
                  summary: post.content.slice(0, 120) + (post.content.length > 120 ? '...' : ''),
                  tags: [],
                }}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              onClick={handleWriteBlog}
            >
              Write New Blog
            </button>
            <button
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition"
              onClick={handleManageUsers}
            >
              Manage Users
            </button>
            <button
              className="px-6 py-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;