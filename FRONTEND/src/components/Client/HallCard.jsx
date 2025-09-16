import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import './hallCard.css';

const HallCard = ({ hall }) => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const handleBookNow = (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        
        if (!isAuthenticated()) {
            localStorage.setItem('redirectAfterLogin', `/client/halls/${hall.id}/book`);
            navigate('/login');
        } else {
            navigate(`/client/halls/${hall.id}/book`);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <div className="hall-card">
            <Link to={`/client/halls/${hall.id}`} className="hall-card-link">
                <div className="hall-card-image">
                    <img 
                        src={hall.image || '/placeholder-hall.jpg'} 
                        alt={hall.name}
                        onError={(e) => {
                            e.target.src = '/placeholder-hall.jpg';
                        }}
                    />
                    <div className="hall-card-overlay">
                        <span className="view-details">View Details</span>
                    </div>
                </div>
                
                <div className="hall-card-content">
                    <div className="hall-card-header">
                        <h3 className="hall-card-title">{hall.name}</h3>
                        <div className="hall-card-rating">
                            <span className="rating-stars">★★★★☆</span>
                            <span className="rating-count">(4.2)</span>
                        </div>
                    </div>
                    
                    <p className="hall-card-description">
                        {hall.description?.length > 100 
                            ? `${hall.description.substring(0, 100)}...` 
                            : hall.description || 'Beautiful venue perfect for your events'
                        }
                    </p>
                    
                    <div className="hall-card-details">
                        <div className="hall-detail">
                            <span className="detail-icon">👥</span>
                            <span className="detail-text">Capacity: {hall.capacity} people</span>
                        </div>
                        
                        <div className="hall-detail">
                            <span className="detail-icon">📍</span>
                            <span className="detail-text">{hall.location || 'Prime Location'}</span>
                        </div>
                        
                        <div className="hall-detail">
                            <span className="detail-icon">🏢</span>
                            <span className="detail-text">{hall.type || 'Event Hall'}</span>
                        </div>
                    </div>
                    
                    <div className="hall-card-footer">
                        <div className="hall-card-price">
                            <span className="price-label">Starting from</span>
                            <span className="price-amount">{formatPrice(hall.price)}</span>
                            <span className="price-period">/hour</span>
                        </div>
                        
                        <button 
                            onClick={handleBookNow}
                            className="book-now-btn"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </Link>
            
            <div className="hall-card-features">
                {hall.features && hall.features.length > 0 && (
                    <div className="features-list">
                        {hall.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="feature-tag">
                                {feature}
                            </span>
                        ))}
                        {hall.features.length > 3 && (
                            <span className="feature-tag more">
                                +{hall.features.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HallCard;