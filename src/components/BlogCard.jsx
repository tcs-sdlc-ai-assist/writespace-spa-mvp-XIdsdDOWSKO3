import React from 'react';
import PropTypes from 'prop-types';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * BlogCard component displays a blog post summary.
 * Shows edit/delete buttons if current user is owner or admin.
 * @param {Object} props
 * @param {Object} props.post - Blog post object
 * @param {Function} [props.onEdit] - Edit handler
 * @param {Function} [props.onDelete] - Delete handler
 */
function BlogCard({ post, onEdit, onDelete }) {
  const session = getSession();
  const isOwner = session && session.userId === post.authorId;
  const isAdmin = session && session.role === 'admin';
  const canEdit = isOwner || isAdmin;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex flex-col md:flex-row md:items-center md:space-x-6">
      <div className="flex items-center mb-4 md:mb-0">
        {getAvatar(post.authorRole)}
        <div>
          <div className="font-semibold text-gray-900">{post.authorName}</div>
          <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-xl font-bold text-gray-800 mb-2">{post.title}</div>
        <div className="text-gray-600 line-clamp-3 mb-2">{post.summary}</div>
        <div className="flex space-x-2 mt-2">
          {post.tags && post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">{tag}</span>
          ))}
        </div>
      </div>
      {canEdit && (
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 mt-4 md:mt-0">
          {onEdit && (
            <button
              className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
              onClick={() => onEdit(post)}
              type="button"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => onDelete(post)}
              type="button"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorRole: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default BlogCard;