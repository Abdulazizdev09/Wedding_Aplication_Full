import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHallById, createBooking, getHallBookings } from '../../api/clientApi';
import { format } from 'date-fns';
import CalendarGrid from '../../components/CalendarGrid/CalendarGrid';
import './bookingPage.css';

const BookingPage = () => {
  const { hall_id } = useParams();
  const navigate = useNavigate();

  const [hall, setHall] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hallResponse, bookingsResponse] = await Promise.all([
          getHallById(hall_id),
          getHallBookings(hall_id)
        ]);
        setHall(hallResponse.data);
        // 🔄 FIXED: Handle different possible field names for booked dates
        const bookedDates = bookingsResponse.data?.map(booking =>
          booking.event_date || booking.booking_date || booking.booked_date
        ) || [];
        setBookings(bookedDates);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (hall_id) {
      fetchData();
    }
  }, [hall_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    if (numberOfSeats > hall?.capacity) {
      setError(`Maximum capacity is ${hall.capacity} seats`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 🔄 FIXED: Send event_date (not booking_date) to match backend expectations
      const bookingData = {
        hall_id: parseInt(hall_id),
        event_date: format(selectedDate, 'yyyy-MM-dd'),  // Changed from booking_date to event_date
        number_of_seats: parseInt(numberOfSeats),
      };

      console.log('🎯 Frontend sending booking data:', bookingData);

      await createBooking(bookingData);
      navigate('/client/my-bookings', {
        state: { message: 'Booking confirmed successfully!' }
      });
    } catch (err) {
      console.error('🎯 Frontend booking error:', err);
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!hall || !numberOfSeats) return 0;
    return numberOfSeats * parseFloat(hall.price_per_seat);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(parseFloat(price));
  };

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !hall) {
    return (
      <div className="booking-error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <button
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            ← Back
          </button>
          <h1>Book {hall?.name}</h1>
        </div>

        {/* Main Content */}
        <div className="booking-content">
          {/* Hall Info */}
          <div className="hall-info">
            <div className="hall-detail">
              <span className="label">Capacity:</span>
              <span className="value">{hall?.capacity} guests</span>
            </div>
            <div className="hall-detail">
              <span className="label">Price:</span>
              <span className="value">{formatPrice(hall?.price_per_seat)} so'm/seat</span>
            </div>
            <div className="hall-detail">
              <span className="label">Region:</span>
              <span className="value">{hall?.region}</span>
            </div>
            {hall?.phone_number && (
              <div className="hall-detail">
                <span className="label">Phone:</span>
                <span className="value">{hall.phone_number}</span>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="calendar-section">
            <h3>Select Date</h3>
            <CalendarGrid
              bookedDates={bookings}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            {selectedDate && (
              <div className="selected-date-info">
                <strong>Selected Date: </strong>
                {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="seats-input">
              <label>Number of Seats</label>
              <input
                type="number"
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(e.target.value)}
                min="1"
                max={hall?.capacity}
                required
              />
              <span className="max-info">Max: {hall?.capacity}</span>
            </div>

            {/* Price Summary */}
            {numberOfSeats > 0 && (
              <div className="price-summary">
                <div className="price-row">
                  <span>{numberOfSeats} × {formatPrice(hall?.price_per_seat)}</span>
                  <span className="total">{formatPrice(calculateTotal())} so'm</span>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={submitting || !selectedDate}
              className="book-button"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;