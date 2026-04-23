import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../utils/storage';

/**
 * ProtectedRoute component for role-based access control.
 * Wraps children and redirects to "/" if not authorized.
 * @param {Object} props
 * @param {string} props.requiredRole - Role required to access the route
 * @param {React.ReactNode} props.children - Children to render if authorized
 */
function ProtectedRoute({ requiredRole, children }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    const session = getSession();
    if (!session || session.role !== requiredRole) {
      navigate('/', { replace: true });
    }
  }, [requiredRole, navigate]);

  const session = getSession();
  if (!session || session.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  requiredRole: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;