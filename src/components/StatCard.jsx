import React from 'react';
import PropTypes from 'prop-types';

function StatCard({ count, label, icon }) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md space-x-4">
      <div className="text-3xl text-blue-500">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{count}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

export default StatCard;