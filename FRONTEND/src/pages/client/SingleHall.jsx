import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHallById } from '../../api/clientApi';
import useAuthStore from '../../store/useAuthStore';
import { ArrowLeft } from 'lucide-react';
import './singleHall.css';

const SingleHall = () => {
  const { hall_id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        setLoading(true);
        const response = await getHallById(hall_id);
        setHall(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch hall details');
      } finally {
        setLoading(false);
      }
    };

    if (hall_id) {
      fetchHall();
    }
  }, [hall_id]);

  const handleBookClick = () => {
    if (isAuthenticated()) {
      navigate(`/client/halls/${hall_id}/book`);
    } else {
      localStorage.setItem('redirectAfterLogin', `/client/halls/${hall_id}/book`);
      navigate('/login');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&auto=format';
    }

    let pathString;
    if (typeof imagePath === 'string') {
      pathString = imagePath;
    } else if (imagePath && imagePath.image_path) {
      pathString = imagePath.image_path;
    } else {
      return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&auto=format';
    }

    const cleanPath = pathString.replace(/\\/g, '/');

    if (cleanPath.startsWith('http')) {
      return cleanPath;
    }

    const pathWithoutUploads = cleanPath.startsWith('uploads/')
      ? cleanPath.substring('uploads/'.length)
      : cleanPath;

    const baseUrl = 'http://localhost:9000';
    return `${baseUrl}/uploads/${pathWithoutUploads}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(parseFloat(price));
  };

  const calculateTotalPrice = () => {
    if (!hall) return 0;
    return hall.capacity * parseFloat(hall.price_per_seat);
  };

  const getHallImages = () => {
    if (hall?.images && Array.isArray(hall.images) && hall.images.length > 0) {
      const sortedImages = [...hall.images].sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0));
      return sortedImages;
    } else if (hall?.image_path) {
      return [{ image_path: hall.image_path, is_main: true }];
    }
    return [{ image_path: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&auto=format', is_main: true }];
  };

  const handlePreviousImage = () => {
    const images = getHallImages();
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    const images = getHallImages();
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="single-hall-loading">
        <div className="loading-spinner">Loading hall details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="single-hall-error">
        <div className="error-message">Error: {error}</div>
        <button onClick={() => navigate('/client/halls')} className="back-to-halls-btn">
          Back to All Halls
        </button>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="single-hall-not-found">
        <div className="not-found-message">Hall not found</div>
        <button onClick={() => navigate('/client/halls')} className="back-to-halls-btn">
          Back to All Halls
        </button>
      </div>
    );
  }

  const images = getHallImages();

  return (
    <div className="single-hall-page">
      <div className="single-hall-header">
        <button 
          className="back-button"
          onClick={() => navigate('/client/halls')}
        >
          <ArrowLeft size={20} />
          Back to All Halls
        </button>
      </div>

      <div className="single-hall-content">
        <div className="hall-images-section">
          <div className="hall-main-image">
            <img
              src={getImageUrl(images[currentImageIndex])}
              alt={`${hall.name} - Image ${currentImageIndex + 1}`}
              className="main-hall-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&auto=format';
              }}
            />
            
            {images.length > 1 && (
              <div className="image-navigation">
                <button 
                  className="image-nav-btn prev"
                  onClick={handlePreviousImage}
                >
                  ←
                </button>
                <button 
                  className="image-nav-btn next"
                  onClick={handleNextImage}
                >
                  →
                </button>
              </div>
            )}

            {images.length > 1 && (
              <div className="image-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`image-indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="hall-image-thumbnails">
              {images.map((image, index) => (
                <img
                  key={image.id || index}
                  src={getImageUrl(image)}
                  alt={`${hall.name} thumbnail ${index + 1}`}
                  className={`thumbnail-image ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=150&fit=crop&auto=format';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hall-info-section">
          <div className="hall-title-area">
            <h1 className="hall-title">{hall.name}</h1>
            <div className="hall-rating">
              <span className="rating-text">Premium Venue</span>
            </div>
          </div>

          <div className="hall-details-grid">
            <div className="hall-info-card">
              <h3 className="info-card-title">Hall Information</h3>
              <div className="info-card-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Capacity</span>
                    <span className="info-value">{hall.capacity} people</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Price per seat</span>
                    <span className="info-value">{formatPrice(hall.price_per_seat)} so'm</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Full hall price</span>
                    <span className="info-value">{formatPrice(calculateTotalPrice())} so'm</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Region</span>
                    <span className="info-value">{hall.region}</span>
                  </div>
                </div>

                {hall.address && (
                  <div className="info-item">
                    <div className="info-text">
                      <span className="info-label">Address</span>
                      <span className="info-value">{hall.address}</span>
                    </div>
                  </div>
                )}

                {(hall.contact_number || hall.phone_number) && (
                  <div className="info-item">
                    <div className="info-text">
                      <span className="info-label">Contact</span>
                      <span className="info-value">{hall.contact_number || hall.phone_number}</span>
                    </div>
                  </div>
                )}

                {(hall.first_name || hall.last_name) && (
                  <div className="info-item">
                    <div className="info-text">
                      <span className="info-label">Owner</span>
                      <span className="info-value">{hall.first_name} {hall.last_name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hall.description && (
              <div className="hall-description-card">
                <h3 className="info-card-title">Description</h3>
                <div className="info-card-content">
                  <p className="hall-description-text">{hall.description}</p>
                </div>
              </div>
            )}

            <div className="hall-features-card">
              <h3 className="info-card-title">Features & Amenities</h3>
              <div className="info-card-content">
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-icon">🎵</span>
                    <span>Sound System</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💡</span>
                    <span>Professional Lighting</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🅿️</span>
                    <span>Parking Available</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">❄️</span>
                    <span>Air Conditioning</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🍽️</span>
                    <span>Catering Service</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📷</span>
                    <span>Photo-friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <div className="booking-card">
              <div className="booking-card-header">
                <h3 className="booking-card-title">Ready to Book?</h3>
                <p className="booking-card-subtitle">
                  Secure your dream venue today
                </p>
              </div>
              
              <div className="booking-card-content">
                <div className="price-highlight">
                  <span className="price-label">Starting from</span>
                  <span className="price-value">
                    {formatPrice(hall.price_per_seat)} so'm
                  </span>
                  <span className="price-unit">per seat</span>
                </div>

                <button 
                  className="book-hall-button"
                  onClick={handleBookClick}
                >
                  {isAuthenticated() ? 'Book This Hall' : 'Login to Book'}
                </button>

                <p className="booking-note">
                  * Final price depends on number of guests and selected date
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleHall;