import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';
import PublicNavbar from '../components/PublicNavbar';

function LandingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    try {
      const allPosts = getPosts();
      // Sort by createdAt descending, show up to 3
      const sorted = [...allPosts].sort((a, b) => b.createdAt - a.createdAt);
      setPosts(sorted.slice(0, 3));
    } catch (e) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">WriteSpace</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            A modern, distraction-free platform for writers, bloggers, and note-takers. Create, edit, and share your thoughts with ease.
          </p>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition text-lg"
          >
            Get Started
          </a>
        </section>

        {/* Features Section */}
        <section className="max-w-4xl mx-auto py-10 px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <span className="text-4xl mb-3">📝</span>
              <div className="text-lg font-semibold mb-2">Minimal Editor</div>
              <div className="text-gray-600 text-sm text-center">
                Focus on your writing with a clean, distraction-free interface.
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <span className="text-4xl mb-3">🔒</span>
              <div className="text-lg font-semibold mb-2">Private & Secure</div>
              <div className="text-gray-600 text-sm text-center">
                Your content stays yours. Simple local storage, no cloud, no ads.
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <span className="text-4xl mb-3">🚀</span>
              <div className="text-lg font-semibold mb-2">Fast & Responsive</div>
              <div className="text-gray-600 text-sm text-center">
                Built with React and Vite for instant load times and smooth experience.
              </div>
            </div>
          </div>
        </section>

        {/* Latest Posts Preview */}
        <section className="max-w-3xl mx-auto py-10 px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Latest Posts</h2>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
              <span className="ml-3 text-gray-500">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-semibold">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500">No posts yet. Be the first to write!</div>
          ) : (
            <div>
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block hover:bg-gray-100 rounded transition"
                >
                  <BlogCard
                    post={{
                      id: post.id,
                      title: post.title,
                      summary: post.content.slice(0, 120) + (post.content.length > 120 ? '...' : ''),
                      authorId: post.authorId,
                      authorName: post.authorUsername || 'Unknown',
                      authorRole: 'user',
                      createdAt: post.createdAt,
                      tags: [],
                    }}
                  />
                </a>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <a
              href="/dashboard"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              View All Posts
            </a>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full py-6 bg-white shadow-inner mt-auto">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <span className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </span>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <a
              href="/login"
              className="text-blue-600 hover:underline text-sm"
            >
              Login
            </a>
            <a
              href="/register"
              className="text-blue-600 hover:underline text-sm"
            >
              Register
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;