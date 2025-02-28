import React from 'react';


const AnimatedCard = ({ title, imageUrl, description, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', margin: '0 20px' }}>
      <div className="card-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AnimatedCard;
