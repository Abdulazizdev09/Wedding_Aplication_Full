import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBookings, cancelBooking } from '../../api/clientApi';
import { format, parseISO, isBefore, isToday } from 'date-fns';
import { Calendar, Users, X, Check } from 'lucide-react';
import './myBookings.css';

const MyBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchBookings();

    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookings();
      setBookings(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatus = (bookingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const booking = parseISO(bookingDate);

    if (isBefore(booking, today)) {
      return 'completed';
    } else if (isToday(booking)) {
      return 'today';
    } else {
      return 'upcoming';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'today': return 'status-today';
      case 'upcoming': return 'status-upcoming';
      default: return '';
    }
  };

  const canCancelBooking = (bookingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const booking = parseISO(bookingDate);
    return !isBefore(booking, today);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setSuccessMessage('Booking cancelled successfully');
      fetchBookings();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="my-bookings-loading">
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-header">
        <h1 className="my-bookings-title">My Bookings</h1>
        <button
          className="browse-halls-btn"
          onClick={() => navigate('/client/halls')}
        >
          Browse More Halls
        </button>
      </div>

      {successMessage && (
        <div className="success-message">
          <Check size={20} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          <X size={20} />
          {error}
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <Calendar size={48} className="no-bookings-icon" />
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet. Start by browsing our wedding halls!</p>
          <button
            className="browse-halls-cta"
            onClick={() => navigate('/client/halls')}
          >
            Browse Wedding Halls
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => {
            const bookingDate = booking.booking_date || booking.event_date;
            const status = getBookingStatus(bookingDate);

            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-id">
                    Booking #{booking.id.toString().padStart(4, '0')}
                  </div>
                  <div className={`booking-status ${getStatusClass(status)}`}>
                    {getStatusText(status)}
                  </div>
                </div>

                <div className="booking-card-content">
                  <div className="booking-hall-info">
                    <h3 className="hall-name">
                      {booking.hall_name || `Hall ID: ${booking.hall_id}`}
                    </h3>

                    <div className="booking-details">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{format(parseISO(bookingDate), 'EEEE, MMMM dd, yyyy')}</span>
                      </div>

                      <div className="detail-item">
                        <Users size={16} />
                        <span>{booking.number_of_seats || booking.booked_seats} seats</span>
                      </div>

                      {booking.hall_region && (
                        <div className="detail-item">
                          <span>📍 {booking.hall_region}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button
                      className="view-hall-btn"
                      onClick={() => navigate(`/client/halls/${booking.hall_id}`)}
                    >
                      View Hall
                    </button>

                    {canCancelBooking(bookingDate) && (
                      <button
                        className="cancel-booking-btn"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="booking-card-footer">
                  <small className="booking-date">
                    Booked on {booking.booked_date ? 
                      format(parseISO(booking.booked_date), 'MMM dd, yyyy') : 
                      'Unknown date'
                    }
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;