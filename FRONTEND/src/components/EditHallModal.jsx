import React, { useState, useEffect } from "react";
import { getOwners } from "../api/adminApi"; // Assuming this path is correct
import "./editHallModal.css"

export default function EditHallModal({ isOpen, onClose, onConfirm, hall, regions, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    capacity: "",
    price_per_seat: "",
    status: "",
    owner_id: "",
    phone_number: "", // Added phone_number to formData
  });

  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [ownersError, setOwnersError] = useState(null);

  // Fetch owners on mount
  useEffect(() => {
    const fetchOwners = async () => {
      setOwnersLoading(true);
      setOwnersError(null);
      try {
        const data = await getOwners();
        setOwners(data);
      } catch {
        setOwnersError("Failed to load owners.");
      } finally {
        setOwnersLoading(false);
      }
    };

    fetchOwners();
  }, []);

  // Load hall data into form when hall changes
  useEffect(() => {
    if (hall) {
      setFormData({
        name: hall.name || "",
        region: hall.region || "",
        capacity: hall.capacity || "",
        price_per_seat: hall.price_per_seat || "",
        status: hall.status || "confirmed",
        owner_id: hall.owner_id || "",
        phone_number: hall.phone_number || "", // Initialize phone_number from hall data
      });
    }
  }, [hall]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="edit-hall-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="edit-hall-title" className="modal-title">
            Edit Wedding Hall
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close edit modal"
            className="close-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="close-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Name */}
            <div className="form-field full-width">
              <label htmlFor="name" className="form-label">
                Hall Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter hall name"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            {/* Region */}
            <div className="form-field">
              <label htmlFor="region" className="form-label">
                Region
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="form-select"
                disabled={isLoading}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity */}
            <div className="form-field">
              <label htmlFor="capacity" className="form-label">
                Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={0}
                value={formData.capacity}
                onChange={handleChange}
                required
                placeholder="Enter capacity"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            {/* Price per Seat */}
            <div className="form-field">
              <label htmlFor="price_per_seat" className="form-label">
                Price per Seat
              </label>
              <input
                id="price_per_seat"
                name="price_per_seat"
                type="number"
                step="0.01"
                min={0}
                value={formData.price_per_seat}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            {/* Phone Number - NEW FIELD */}
            <div className="form-field">
              <label htmlFor="phone_number" className="form-label">
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel" // Use type="tel" for phone numbers
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="e.g., +998 90 123 45 67"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            {/* Status */}
            <div className="form-field">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="form-select"
                disabled={isLoading}
              >
                <option value="confirmed">Confirmed</option>
                <option value="unconfirmed">Unconfirmed</option>
              </select>
            </div>

            {/* Owner */}
            <div className="form-field full-width">
              <label htmlFor="owner_id" className="form-label">
                Owner
              </label>
              {ownersLoading ? (
                <div className="loading-state">
                  <svg className="loading-spinner" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Loading owners...
                </div>
              ) : ownersError ? (
                <div className="error-state">
                  {ownersError}
                </div>
              ) : (
                <select
                  id="owner_id"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isLoading}
                >
                  <option value="">Select Owner</option>
                  {owners.map((owner, index) => (
                    <option key={owner.id} value={owner.id}>
                      {index + 1}. {owner.first_name} {owner.last_name || ''} {/* Added last_name for better display */}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cancel-button"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <svg
                    className="button-spinner"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="spinner-circle"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="spinner-path"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}