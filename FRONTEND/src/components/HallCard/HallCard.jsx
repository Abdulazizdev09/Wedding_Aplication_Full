import React from "react";
import "./HallCard.css";
import { useNavigate } from "react-router-dom";

const HallCard = React.memo(({ hall }) => {
  const navigate = useNavigate();

  const {
    id,
    name,
    region,
    capacity,
    price_per_seat,
    status,
    images = [],
  } = hall;

  // Find main image or fallback
  const mainImageObj = images.find(img => img.is_main) || {};
  const mainImageUrl = mainImageObj.image_path
    ? `http://localhost:4000/${mainImageObj.image_path.replace(/\\\\/g, "/")}`
    : "/default-hall.jpg";

  const handleClick = () => {
    navigate(`/halls/${id}`);
  };

  return (
    <div className="hall-card" onClick={handleClick} role="button" tabIndex={0} onKeyPress={e => { if(e.key === 'Enter') handleClick(); }}>
      <div className="hall-image-container">
        <img src={mainImageUrl} alt={`${name} main`} className="hall-image" />
      </div>
      <div className="hall-info">
        <h3 className="hall-name">{name}</h3>
        <p className="hall-region">📍 {region}</p>
        <p className="hall-capacity">👥 Capacity: {capacity}</p>
        <p className="hall-price">💲 Price per seat: ${price_per_seat}</p>
        <p className={`hall-status ${status.toLowerCase()}`}>Status: {status}</p>
      </div>
    </div>
  );
});

export default HallCard;
