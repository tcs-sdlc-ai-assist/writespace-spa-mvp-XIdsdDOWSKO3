/**
 * Utility functions for interacting with localStorage for users, posts, and session.
 * All functions handle errors defensively and return sensible defaults.
 */

/**
 * @returns {Array<Object>} Array of user objects, or [] if not found/error
 */
export function getUsers() {
  try {
    const users = localStorage.getItem('users');
    if (!users) return [];
    const parsed = JSON.parse(users);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * @param {Array<Object>} users
 * @returns {boolean} true if successful, false otherwise
 */
export function setUsers(users) {
  try {
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @returns {Array<Object>} Array of post objects, or [] if not found/error
 */
export function getPosts() {
  try {
    const posts = localStorage.getItem('posts');
    if (!posts) return [];
    const parsed = JSON.parse(posts);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * @param {Array<Object>} posts
 * @returns {boolean} true if successful, false otherwise
 */
export function setPosts(posts) {
  try {
    localStorage.setItem('posts', JSON.stringify(posts));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @returns {Object|null} Session object if exists, null otherwise
 */
export function getSession() {
  try {
    const session = localStorage.getItem('session');
    if (!session) return null;
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

/**
 * @param {Object} session
 * @returns {boolean} true if successful, false otherwise
 */
export function setSession(session) {
  try {
    localStorage.setItem('session', JSON.stringify(session));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Clears the session from localStorage.
 * @returns {boolean} true if successful, false otherwise
 */
export function clearSession() {
  try {
    localStorage.removeItem('session');
    return true;
  } catch (e) {
    return false;
  }
}