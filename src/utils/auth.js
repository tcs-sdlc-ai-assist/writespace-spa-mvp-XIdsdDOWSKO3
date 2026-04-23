import {
  getUsers,
  setUsers,
  getSession,
  setSession,
  clearSession,
} from './storage';

/**
 * Attempts to log in a user with username and password.
 * Sets session if successful.
 * @param {string} username
 * @param {string} password
 * @returns {Object} { success: boolean, user?: Object, error?: string }
 */
export function login(username, password) {
  try {
    const users = getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      return { success: false, error: 'Invalid username or password.' };
    }
    setSession({
      userId: user.id,
      username: user.username,
      role: user.role,
    });
    return { success: true, user };
  } catch (e) {
    return { success: false, error: 'Login failed.' };
  }
}

/**
 * Registers a new user.
 * @param {string} username
 * @param {string} password
 * @param {string} [role='user']
 * @returns {Object} { success: boolean, user?: Object, error?: string }
 */
export function register(username, password, role = 'user') {
  try {
    const users = getUsers();
    if (users.some((u) => u.username === username)) {
      return { success: false, error: 'Username already exists.' };
    }
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      role,
    };
    users.push(newUser);
    setUsers(users);
    setSession({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });
    return { success: true, user: newUser };
  } catch (e) {
    return { success: false, error: 'Registration failed.' };
  }
}

/**
 * Logs out the current user.
 * @returns {Object} { success: boolean }
 */
export function logout() {
  try {
    clearSession();
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

/**
 * Checks if the current session user has the required role.
 * Throws error if not authorized.
 * @param {string} requiredRole
 * @returns {boolean}
 */
export function requireRole(requiredRole) {
  const session = getSession();
  if (!session) {
    throw new Error('Not authenticated.');
  }
  if (session.role !== requiredRole) {
    throw new Error('Not authorized.');
  }
  return true;
}