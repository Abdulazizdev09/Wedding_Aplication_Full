import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHall } from "../../api/ownerApi";  // owner API
import { getUserId } from "../../utils/auth";
import {
  FiUpload,
  FiX,
  FiHome,
  FiMapPin,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";
import "../admin/addHall.css"

export default function AddHall() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    region: "",
    capacity: "",
    price_per_seat: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages.length === 0) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("region", formData.region);
      formDataToSubmit.append("capacity", formData.capacity);
      formDataToSubmit.append("price_per_seat", formData.price_per_seat);


    } catch (err) {
      setErrorMessage("Failed to create hall, please try again.");
      setIsSubmitting(false);
    }
  };


  // Add files state:
  const [files, setFiles] = useState([]);

  // Update handleImageChange:
  const handleImageChangeNew = (e) => {
    const newFiles = Array.from(e.target.files);
    const newImages = newFiles.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newImages]);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Update handleSubmit to append actual files:
  const handleSubmitNew = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("region", formData.region);
      formDataToSubmit.append("capacity", formData.capacity);
      formDataToSubmit.append("price_per_seat", formData.price_per_seat);

      // Add owner_id from auth util
      const ownerId = getUserId();
      if (!ownerId) {
        setErrorMessage("Owner authentication error.");
        setIsSubmitting(false);
        return;
      }
      formDataToSubmit.append("owner_id", ownerId);

      files.forEach((file) => {
        formDataToSubmit.append("images", file);
      });

      await createHall(formDataToSubmit);

      setIsSubmitting(false);
      navigate("/owner/halls");
    } catch (error) {
      setErrorMessage("Failed to create hall, please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-hall-wrapper">
      <div className="add-hall-container">
        <div className="header-section">
          <div className="header-icon">
            <FiHome />
          </div>
          <h1 className="header-title">Create Wedding Hall</h1>
          <p className="header-subtitle">Add a new venue to your collection</p>
        </div>

        <form onSubmit={handleSubmitNew} className="hall-form" noValidate>
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>

            <div className="input-group">
              <div className="input-wrapper">
                <FiHome className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`form-input ${formData.name ? "has-value" : ""}`}
                />
                <label className="floating-label">Hall Name</label>
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <FiMapPin className="input-icon" />
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  className={`form-select ${formData.region ? "has-value" : ""}`}
                >
                  <option value="">Choose region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <label className="floating-label">Region</label>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half-width">
                <div className="input-wrapper">
                  <FiUsers className="input-icon" />
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                    className={`form-input ${formData.capacity ? "has-value" : ""}`}
                  />
                  <label className="floating-label">Capacity</label>
                </div>
              </div>

              <div className="input-group half-width">
                <div className="input-wrapper">
                  <FiDollarSign className="input-icon" />
                  <input
                    type="number"
                    name="price_per_seat"
                    value={formData.price_per_seat}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                    className={`form-input ${formData.price_per_seat ? "has-value" : ""}`}
                  />
                  <label className="floating-label">Price per Seat (so'm)</label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Hall Images</h3>

            <div className="upload-section">
              <label htmlFor="file-upload" className="upload-area">
                <div className="upload-content">
                  <FiUpload className="upload-icon" />
                  <span className="upload-text">Choose Images</span>
                  <span className="upload-subtext">Upload multiple images of your hall</span>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChangeNew}
                required
                className="file-input"
              />
            </div>

            {selectedImages.length > 0 && (
              <div className="images-grid">
                {selectedImages.map((image, index) => (
                  <div key={index} className={`image-card ${index === 0 ? "main-image" : ""}`}>
                    <img src={image} alt={`Hall preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => {
                        handleRemoveImage(index);
                        setFiles((prev) => {
                          const newFiles = [...prev];
                          newFiles.splice(index, 1);
                          return newFiles;
                        });
                      }}
                      aria-label="Remove image"
                    >
                      <FiX />
                    </button>
                    {index === 0 && <div className="main-badge">Main</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="error-alert">
              <span className="error-text">{errorMessage}</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/owner/halls")}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Creating...
                </>
              ) : (
                "Create Hall"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
