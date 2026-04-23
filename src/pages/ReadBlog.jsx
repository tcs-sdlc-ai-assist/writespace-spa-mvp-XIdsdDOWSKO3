import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, getUsers } from '../utils/storage';
import { getSession, logout } from '../utils/auth';
import { getAvatar } from '../components/Avatar';

function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const posts = getPosts();
      const foundPost = posts.find((p) => p.id === id);
      if (!foundPost) {
        setError('Post not found.');
        setLoading(false);
        return;
      }
      setPost(foundPost);

      const users = getUsers();
      const foundAuthor = users.find((u) => u.id === foundPost.authorId);
      setAuthor(foundAuthor || { username: 'Unknown', role: 'user' });

      const sess = getSession();
      setSession(sess);
      setLoading(false);
    } catch (e) {
      setError('Failed to load post.');
      setLoading(false);
    }
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-500 text-lg">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-xl font-semibold mb-2">{error}</div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleBack}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 bg-white rounded-lg shadow-lg mt-8">
      <div className="flex items-center mb-6">
        {getAvatar(author.role)}
        <div>
          <div className="text-lg font-semibold text-gray-900">{author.username}</div>
          <div className="text-xs text-gray-500">{author.role.charAt(0).toUpperCase() + author.role.slice(1)}</div>
        </div>
        <div className="ml-auto flex space-x-2">
          {session && (
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          <button
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <div className="text-gray-700 whitespace-pre-line mb-6">{post.content}</div>
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>
          Published: {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown'}
        </span>
        {post.updatedAt && (
          <span>
            Updated: {new Date(post.updatedAt).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default ReadBlog;