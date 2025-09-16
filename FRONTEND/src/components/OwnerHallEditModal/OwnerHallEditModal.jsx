import React, { useEffect, useState } from "react";
import "./ownerHallEditModal.css";

export default function OwnerHallEditModal({ isOpen, onClose, onConfirm, hall, regions, isLoading }) {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    capacity: "",
    price_per_seat: "",
  });

  useEffect(() => {
    if (hall) {
      setFormData({
        name: hall.name || "",
        region: hall.region || "",
        capacity: hall.capacity || "",
        price_per_seat: hall.price_per_seat || "",
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
    <div className="owner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="owner-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="owner-modal-close-btn"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="owner-modal-title">Edit Hall</h2>
        <form className="owner-modal-form" onSubmit={handleSubmit}>
          <label className="owner-modal-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="owner-modal-input"
            placeholder="Enter hall name"
          />

          <label className="owner-modal-label" htmlFor="region">
            Region
          </label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="owner-modal-select"
          >
            <option value="">Select region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <label className="owner-modal-label" htmlFor="capacity">
            Capacity
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="owner-modal-input"
            placeholder="Enter capacity"
          />

          <label className="owner-modal-label" htmlFor="price_per_seat">
            Price per Seat
          </label>
          <input
            id="price_per_seat"
            name="price_per_seat"
            type="number"
            min="0"
            step="0.01"
            value={formData.price_per_seat}
            onChange={handleChange}
            required
            className="owner-modal-input"
            placeholder="Enter price per seat"
          />

          <div className="owner-modal-buttons">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="owner-modal-btn cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="owner-modal-btn confirm-btn"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
