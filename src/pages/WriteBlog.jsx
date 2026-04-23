import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getSession } from '../utils/storage';
import { getPosts, setPosts } from '../utils/storage';
import { requireRole } from '../utils/auth';

/**
 * Blog create/edit form page.
 * - '/write': create new post
 * - '/edit/:id': edit existing post
 * Validates fields, enforces ownership.
 */
function WriteBlog() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setError('');
    setLoading(true);
    try {
      const session = getSession();
      if (!session) {
        setError('You must be logged in to write or edit a blog.');
        setLoading(false);
        return;
      }
      if (id) {
        // Edit mode
        setIsEdit(true);
        const posts = getPosts();
        const post = posts.find((p) => p.id === id);
        if (!post) {
          setError('Post not found.');
          setLoading(false);
          return;
        }
        // Ownership check: admin can edit any, user only own
        if (
          session.role !== 'admin' &&
          post.authorId !== session.userId
        ) {
          setError('You are not authorized to edit this post.');
          setLoading(false);
          return;
        }
        setTitle(post.title);
        setContent(post.content);
      } else {
        setIsEdit(false);
        setTitle('');
        setContent('');
      }
    } catch (e) {
      setError('Failed to load post.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError('');
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = getSession();
      if (!session) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }
      requireRole(session.role); // Throws if not authenticated

      // Validation
      if (!title.trim()) {
        setError('Title is required.');
        setLoading(false);
        return;
      }
      if (!content.trim()) {
        setError('Content is required.');
        setLoading(false);
        return;
      }

      const posts = getPosts();
      if (isEdit) {
        // Edit mode
        const idx = posts.findIndex((p) => p.id === id);
        if (idx === -1) {
          setError('Post not found.');
          setLoading(false);
          return;
        }
        // Ownership check
        if (
          session.role !== 'admin' &&
          posts[idx].authorId !== session.userId
        ) {
          setError('You are not authorized to edit this post.');
          setLoading(false);
          return;
        }
        posts[idx] = {
          ...posts[idx],
          title: title.trim(),
          content: content.trim(),
          updatedAt: Date.now(),
        };
        setPosts(posts);
        navigate(`/blog/${id}`);
      } else {
        // Create mode
        const newPost = {
          id: Date.now().toString(),
          title: title.trim(),
          content: content.trim(),
          authorId: session.userId,
          authorUsername: session.username,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        posts.push(newPost);
        setPosts(posts);
        navigate(`/blog/${newPost.id}`);
      }
    } catch (e) {
      setError('Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Blog Post' : 'Write a New Blog Post'}
      </h2>
      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter blog title"
            disabled={loading}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="w-full h-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical"
            placeholder="Write your blog content here..."
            disabled={loading}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {isEdit ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

WriteBlog.propTypes = {};

export default WriteBlog;