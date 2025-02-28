import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Unauthorized Access</h1>
      <p>You don't have the necessary permissions to view this page.</p>
      <Link to="/" style={{  color: 'blue' }}>
        Go back to the Home Page
      </Link>
    </div>
  );
};

export default Unauthorized;
