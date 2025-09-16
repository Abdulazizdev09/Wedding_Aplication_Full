import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHallsPublic } from '../../api/clientApi';
import HallCard from '../../components/Client/HallCard';
import './home.css';

const Home = () => {
  const [featuredHalls, setFeaturedHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeaturedHalls = async () => {
      try {
        const response = await getHallsPublic();
        // Get first 3 halls as featured
        setFeaturedHalls(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured halls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHalls();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to halls page with search parameter
      window.location.href = `/client/halls?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Premium Halls' },
    { number: '1000+', label: 'Events Hosted' },
    { number: '4.8★', label: 'Average Rating' }
  ];

  const services = [
    {
      icon: '🎭',
      title: 'Wedding Halls',
      description: 'Elegant venues perfect for your special day with full service amenities.'
    },
    {
      icon: '🏢',
      title: 'Corporate Events',
      description: 'Professional spaces equipped with modern technology for business meetings.'
    },
    {
      icon: '🎉',
      title: 'Party Venues',
      description: 'Fun and vibrant spaces for birthdays, celebrations, and social gatherings.'
    },
    {
      icon: '🎓',
      title: 'Conference Rooms',
      description: 'Well-equipped halls for seminars, workshops, and educational events.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find the Perfect Hall for Your Perfect Event
            </h1>
            <p className="hero-description">
              Discover premium venues for weddings, corporate events, parties, and more.
              Book your ideal space with just a few clicks.
            </p>

            <form onSubmit={handleSearch} className="hero-search">
              <input
                type="text"
                placeholder="Search for halls by name, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search Halls
              </button>
            </form>

            <div className="hero-actions">
              <Link to="/client/halls" className="cta-primary">
                Browse All Halls
              </Link>
              <a href="#services" className="cta-secondary">
                Learn More
              </a>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://catherinelutherweddings.com/wp-content/uploads/2021/10/Audleys-Wood-Hotel-1.jpg"
              alt="Beautiful event hall"
              onError={(e) => {
                e.target.src = '/placeholder-hero.jpg';
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-description">
              We provide premium venues for all types of events and occasions
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Halls Section */}
      <section className="featured-halls">
        <div className="featured-container">
          <div className="section-header">
            <h2 className="section-title">Featured Halls</h2>
            <p className="section-description">
              Discover our most popular and highly-rated venues
            </p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading featured halls...</p>
            </div>
          ) : (
            <div className="featured-grid">
              {featuredHalls.map(hall => (
                <HallCard key={hall.id} hall={hall} />
              ))}
            </div>
          )}

          <div className="featured-actions">
            <Link to="/client/halls" className="view-all-btn">
              View All Halls
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Book Your Perfect Hall?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers who have found their ideal venues with us.
              Start planning your event today!
            </p>
            <div className="cta-actions">
              <Link to="/client/halls" className="cta-btn-primary">
                Start Booking Now
              </Link>
              <Link to="/register" className="cta-btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;