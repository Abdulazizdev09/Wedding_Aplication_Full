import React, { useEffect, useState } from "react";
import { getOwnerBookings, cancelBooking } from "../../api/ownerApi";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  MapPin,
  Users,
  Building2,
  Phone,
  User,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format, parseISO, isToday, isBefore } from 'date-fns';

export default function MyHallBookings() {
  const [bookings, setBookings] = useState([]);
  const [rawBookings, setRawBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("event_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const regions = [
    "Chilonzor",
    "Sergeli", 
    "Yakkasaray",
    "Shayxontohur",
    "Uchtepa",
    "Yunusobod",
    "Mirobod",
    "Olmazor",
    "Yashnobod",
    "Bektemir",
    "Mirzo Ulugbek",
    "Almazar",
  ];

  const statuses = ["will_happen", "happened", "canceled"];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sortField, sortOrder, filterRegion, filterStatus, rawBookings]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOwnerBookings();
      // Handle both response structures
      const bookingsData = data.bookings || data.data || data;
      setRawBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your bookings");
      setRawBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rawBookings];

    // Filter by region
    if (filterRegion) {
      filtered = filtered.filter((b) => b.region === filterRegion);
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    // Search filter
    if (searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), "i");
      filtered = filtered.filter((b) => 
        regex.test(b.hall_name || '') || 
        regex.test(b.booker_name || '') || 
        regex.test(b.booker_surname || '') ||
        regex.test(b.booker_phone_number || '') ||
        regex.test(b.booking_id?.toString() || '')
      );
    }

    // Sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        // Handle date fields
        if (sortField === "event_date" || sortField === "booked_date") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        // Handle numeric fields
        if (sortField === "booked_seats" || sortField === "booking_id") {
          aVal = Number(aVal) || 0;
          bVal = Number(bVal) || 0;
        }

        // Handle string fields
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setBookings(filtered);
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      await cancelBooking(bookingToCancel.booking_id);
      // Refresh bookings list
      await fetchBookings();
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleModalClose = () => {
    if (!isCancelling) {
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getBookingStatusInfo = (booking) => {
    const eventDate = parseISO(booking.event_date);
    const today = new Date();
    
    switch (booking.status) {
      case 'canceled':
        return { text: 'Canceled', class: 'canceled', icon: X };
      case 'happened':
        return { text: 'Happened', class: 'happened', icon: CheckCircle };
      case 'will_happen':
        if (isBefore(eventDate, today)) {
          return { text: 'Will Happen', class: 'will-happen', icon: Clock };
        }
        if (isToday(eventDate)) {
          return { text: 'Today', class: 'today', icon: AlertCircle };
        }
        return { text: 'Will Happen', class: 'will-happen', icon: Clock };
      default:
        return { text: booking.status, class: 'unknown', icon: AlertCircle };
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatDay = (dateString) => {
    try {
      return format(parseISO(dateString), 'EEEE');
    } catch {
      return '';
    }
  };

  return (
    <div className="owner-bookings-container">
      {/* Header */}
      <div className="owner-header">
        <div className="owner-header-left">
          <div className="owner-icon">
            <Calendar size={24} />
          </div>
          <div className="owner-title-group">
            <h1 className="owner-title">My Hall Bookings</h1>
            <span className="owner-count">{rawBookings.length} total bookings</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="owner-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search bookings, halls, or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-wrapper">
          <div className="filter-group">
            <MapPin size={16} />
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="filter-select"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting buttons */}
          <div className="sort-buttons">
            <button
              onClick={() => handleSortChange("event_date")}
              className={`sort-btn ${sortField === "event_date" ? "active" : ""}`}
              title="Sort by event date"
            >
              <Calendar size={16} />
              Date
              {sortField === "event_date" && (
                <ArrowUpDown size={14} className={sortOrder === "desc" ? "rotate-180" : ""} />
              )}
            </button>
            <button
              onClick={() => handleSortChange("hall_name")}
              className={`sort-btn ${sortField === "hall_name" ? "active" : ""}`}
              title="Sort by hall name"
            >
              <Building2 size={16} />
              Hall
              {sortField === "hall_name" && (
                <ArrowUpDown size={14} className={sortOrder === "desc" ? "rotate-180" : ""} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-alert">
          <p>{error}</p>
        </div>
      )}

      {/* Table Container */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>No bookings found for your halls</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Hall Details</th>
                  <th>Event Date</th>
                  <th>Seats</th>
                  <th>Client Details</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const statusInfo = getBookingStatusInfo(booking);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={booking.booking_id}>
                      <td>
                        <div className="booking-id-cell">
                          <span className="booking-id">#{booking.booking_id}</span>
                        </div>
                      </td>
                      <td>
                        <div className="hall-cell">
                          <div className="hall-avatar">
                            <Building2 size={20} />
                          </div>
                          <div className="hall-info">
                            <span className="hall-name">{booking.hall_name || 'Unknown Hall'}</span>
                            <div className="location-info">
                              <MapPin size={14} />
                              <span>{booking.region || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={16} />
                          <div className="date-info">
                            <span className="event-date">
                              {formatDate(booking.event_date)}
                            </span>
                            <span className="event-day">
                              {formatDay(booking.event_date)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="seats-cell">
                          <Users size={16} />
                          <span>{booking.booked_seats || 0}</span>
                        </div>
                      </td>
                      <td>
                        <div className="client-cell">
                          <User size={16} />
                          <div className="client-info">
                            <span className="client-name">
                              {booking.booker_name || ''} {booking.booker_surname || ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="phone-cell">
                          <Phone size={14} />
                          <span>{booking.booker_phone_number || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`status-badge ${statusInfo.class}`}>
                          <StatusIcon size={14} />
                          <span>{statusInfo.text}</span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleCancelClick(booking)}
                          className={`cancel-btn ${booking.status === 'canceled' || booking.status === 'happened' ? 'disabled' : ''}`}
                          aria-label={`Cancel booking #${booking.booking_id}`}
                          disabled={booking.status === 'canceled' || booking.status === 'happened'}
                        >
                          <X size={16} />
                          {booking.status === 'canceled' ? 'Canceled' : booking.status === 'happened' ? 'Completed' : 'Cancel'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={handleModalClose}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        message={`Are you sure you want to cancel booking #${bookingToCancel?.booking_id} for "${bookingToCancel?.hall_name}"? This action cannot be undone.`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        isLoading={isCancelling}
        type="danger"
      />

      <style jsx>{`
        .owner-bookings-container {
          padding: 0;
          margin: 0;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .owner-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px 30px;
          background: white;
          border-bottom: 1px solid #dee2e6;
        }

        .owner-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .owner-icon {
          width: 48px;
          height: 48px;
          background: #28a745;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .owner-title {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .owner-count {
          color: #6c757d;
          font-size: 14px;
          margin: 4px 0 0 0;
        }

        .owner-controls {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 0 30px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 45px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }

        .filters-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .filter-select {
          border: none;
          background: none;
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }

        .sort-buttons {
          display: flex;
          gap: 8px;
        }

        .sort-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .sort-btn:hover {
          background: #f8f9fa;
        }

        .sort-btn.active {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        .error-alert {
          background: #fee;
          border: 1px solid #fcc;
          color: #c66;
          padding: 12px 20px;
          border-radius: 6px;
          margin: 0 30px 20px;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin: 0 30px;
        }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #28a745;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bookings-table th {
          background: #f8f9fa;
          padding: 16px 12px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          font-size: 14px;
          border-bottom: 1px solid #dee2e6;
        }

        .bookings-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f3f4;
          vertical-align: top;
        }

        .bookings-table tr:hover {
          background: #f8f9fa;
        }

        .booking-id-cell {
          font-weight: 600;
          color: #28a745;
        }

        .hall-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hall-avatar {
          width: 40px;
          height: 40px;
          background: #e8f5e8;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #28a745;
          flex-shrink: 0;
        }

        .hall-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hall-name {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6c757d;
          font-size: 12px;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .event-date {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        .event-day {
          color: #6c757d;
          font-size: 12px;
        }

        .seats-cell, .phone-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #495057;
        }

        .client-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .client-name {
          font-weight: 500;
          color: #2c3e50;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.will-happen {
          background: #cce5ff;
          color: #004085;
        }

        .status-badge.happened {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.canceled {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.today {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.unknown {
          background: #e2e3e5;
          color: #495057;
        }

        .actions-cell {
          text-align: center;
        }

        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .cancel-btn:hover:not(.disabled) {
          background: #c82333;
        }

        .cancel-btn.disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .owner-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-wrapper {
            min-width: 100%;
          }
          
          .filters-wrapper {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}