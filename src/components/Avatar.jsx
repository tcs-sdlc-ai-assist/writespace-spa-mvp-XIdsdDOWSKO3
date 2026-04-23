function getAvatar(role) {
  let emoji = '';
  let bgColor = '';
  let label = '';

  if (role === 'admin') {
    emoji = '👑';
    bgColor = '#FFD700';
    label = 'Admin';
  } else if (role === 'user') {
    emoji = '📚';
    bgColor = '#4F8CFF';
    label = 'User';
  } else {
    emoji = '❓';
    bgColor = '#CCCCCC';
    label = 'Unknown';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        color: '#222',
        borderRadius: '50%',
        width: 32,
        height: 32,
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8,
        userSelect: 'none',
      }}
      title={label}
      aria-label={label}
    >
      {emoji}
    </span>
  );
}

export { getAvatar };