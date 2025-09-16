import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHallsPublic } from '../../api/clientApi';
import { Search, MapPin, Users, DollarSign, Phone, Star, ArrowUp, ArrowDown } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import './allHalls.css';

const AllHalls = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const regions = [
    "Chilonzor", "Sergeli", "Yakkasaray", "Shayxontohur", "Uchtepa", "Yunusobod",
    "Mirobod", "Olmazor", "Yashnobod", "Bektemir", "Mirzo Ulugbek", "Almazar"
  ];

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const response = await getHallsPublic();
      setHalls(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load wedding halls. Please try again later.');
      console.error('Error fetching halls:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const sortHalls = (hallsToSort) => {
    const sorted = [...hallsToSort];

    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price_per_seat);
          const priceB = parseFloat(b.price_per_seat);
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
      case 'capacity':
        return sorted.sort((a, b) => {
          return sortOrder === 'asc' ? a.capacity - b.capacity : b.capacity - a.capacity;
        });
      case 'name':
      default:
        return sorted.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
    }
  };

  const filteredAndSortedHalls = () => {
    const filtered = halls.filter(hall => {
      const matchesSearch = hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hall.region.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || hall.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    return sortHalls(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(parseFloat(price));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop&auto=format';
    }

    const cleanPath = imagePath.replace(/\\/g, '/');

    if (cleanPath.startsWith('http')) {
      return cleanPath;
    }

    const pathWithoutUploads = cleanPath.startsWith('uploads/')
      ? cleanPath.substring('uploads/'.length)
      : cleanPath;

    const baseUrl = 'http://localhost:9000';
    return `${baseUrl}/uploads/${pathWithoutUploads}`;
  };

  const handleViewDetails = (hallId) => {
    navigate(`/client/halls/${hallId}`); // 🔄 FIXED: Added /client prefix
  };

  const handleBookNow = (hallId) => {
    if (isAuthenticated()) {
      navigate(`/client/halls/${hallId}/book`); // 🔄 FIXED: Added leading slash and /client prefix
    } else {
      localStorage.setItem('redirectAfterLogin', `/client/halls/${hallId}/book`); // 🔄 FIXED: Added leading slash and /client prefix
      navigate('/login');
    }
  };

  const displayedHalls = filteredAndSortedHalls();

  if (loading) {
    return (
      <div className="halls-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading wedding halls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="halls-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchHalls} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="halls-container">
      <div className="halls-header">
        <h1 className="halls-title">Premium Wedding Venues</h1>
        <p className="halls-subtitle">Discover extraordinary spaces for your dream celebration</p>
      </div>

      <div className="halls-filters">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search halls by name or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="region-filter">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sort-controls">
        <span className="sort-label">Sort by:</span>
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => handleSort('name')}
          >
            Name
            {sortBy === 'name' && (
              sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
            )}
          </button>
          <button
            className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
            onClick={() => handleSort('price')}
          >
            Price
            {sortBy === 'price' && (
              sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
            )}
          </button>
          <button
            className={`sort-btn ${sortBy === 'capacity' ? 'active' : ''}`}
            onClick={() => handleSort('capacity')}
          >
            Capacity
            {sortBy === 'capacity' && (
              sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="halls-stats">
        <p className="results-count">
          {displayedHalls.length} hall{displayedHalls.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {displayedHalls.length === 0 ? (
        <div className="no-results">
          <Search size={48} className="no-results-icon" />
          <h3>No halls found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="halls-grid">
          {displayedHalls.map(hall => (
            <div key={hall.id} className="hall-card">
              <div className="hall-image-container">
                <img
                  src={getImageUrl(hall.image_path)}
                  alt={hall.name}
                  className="hall-image"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop&auto=format';
                  }}
                />
              </div>

              <div className="hall-content">
                <h3 className="hall-name">{hall.name}</h3>

                <div className="hall-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{hall.region}</span>
                  </div>

                  <div className="detail-item">
                    <Users size={16} />
                    <span>{hall.capacity} guests</span>
                  </div>

                  <div className="detail-item">
                    <DollarSign size={16} />
                    <span>{formatPrice(hall.price_per_seat)} so'm per seat</span>
                  </div>

                  {hall.phone_number && (
                    <div className="detail-item">
                      <Phone size={16} />
                      <span>{hall.phone_number}</span>
                    </div>
                  )}
                </div>

                <div className="hall-pricing">
                  <span className="price-label">Starting from</span>
                  <span className="price-amount">
                    {formatPrice(parseFloat(hall.price_per_seat) * hall.capacity)} so'm
                  </span>
                </div>

                <div className="hall-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewDetails(hall.id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleBookNow(hall.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllHalls;