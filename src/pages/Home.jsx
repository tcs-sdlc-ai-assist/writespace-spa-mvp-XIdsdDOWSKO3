import React, { useEffect, useState } from 'react';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const loadedPosts = getPosts();
      setPosts(loadedPosts);
      const sess = getSession();
      setSession(sess);
      setLoading(false);
    } catch (e) {
      setError('Failed to load posts.');
      setLoading(false);
    }
  }, []);

  const handleEdit = (post) => {
    navigate(`/edit/${post.id}`);
  };

  const handleDelete = (post) => {
    try {
      const updatedPosts = posts.filter((p) => p.id !== post.id);
      setPosts(updatedPosts);
      // Save to storage
      const { setPosts: savePosts } = require('../utils/storage');
      savePosts(updatedPosts);
    } catch (e) {
      setError('Failed to delete post.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-500 text-lg">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-xl font-semibold mb-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Blogs</h1>
      {posts.length === 0 ? (
        <div className="text-gray-500 text-lg">No blog posts found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((post) => (
              <BlogCard
                key={post.id}
                post={{
                  ...post,
                  authorName: post.authorUsername || 'Unknown',
                  authorRole: session && session.userId === post.authorId ? session.role : 'user',
                  summary: post.content.length > 120
                    ? post.content.slice(0, 120) + '...'
                    : post.content,
                  tags: post.tags || [],
                  createdAt: post.createdAt,
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default Home;