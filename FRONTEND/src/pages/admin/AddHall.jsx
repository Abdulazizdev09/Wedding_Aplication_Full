import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHall, getOwners } from "../../api/adminApi";
import { FiUpload, FiX, FiHome } from "react-icons/fi";
import "./addHall.css";

export default function AddHall() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    region: "",
    capacity: "",
    price_per_seat: "",
    owner_id: "",
    phone_number: "",
  });

  // ✅ FIX: Store actual File objects AND preview URLs
  const [selectedFiles, setSelectedFiles] = useState([]); // Actual files
  const [previewUrls, setPreviewUrls] = useState([]); // Preview URLs
  
  const [owners, setOwners] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const ownerData = await getOwners();
        setOwners(ownerData);
      } catch (error) {
        setErrorMessage("Failed to fetch owners.");
      }
    };
    fetchOwners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ✅ FIX: Store both files and preview URLs
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]); // Store actual files
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]); // Store preview URLs
  };

  const handleRemoveImage = (index) => {
    // Clean up object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    const updatedFiles = [...selectedFiles];
    const updatedUrls = [...previewUrls];
    
    updatedFiles.splice(index, 1);
    updatedUrls.splice(index, 1);
    
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    setIsSubmitting(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("region", formData.region);
    formDataToSubmit.append("capacity", formData.capacity);
    formDataToSubmit.append("price_per_seat", formData.price_per_seat);
    formDataToSubmit.append("owner_id", formData.owner_id);
    formDataToSubmit.append("phone_number", formData.phone_number);

    // ✅ FIX: Append actual File objects
    selectedFiles.forEach((file) => {
      formDataToSubmit.append("images", file);
    });

    try {
      const response = await createHall(formDataToSubmit);
      setIsSubmitting(false);
      navigate("/admin/halls");
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error.response?.data?.message || "Failed to create hall, please try again.");
    }
  };

  const regions = [
    "Chilonzor", "Sergeli", "Yakkasaray", "Shayxontohur", "Uchtepa",
    "Yunusobod", "Mirobod", "Olmazor", "Yashnobod", "Bektemir", "Mirzo Ulugbek", "Almazar"
  ];

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

        <form onSubmit={handleSubmit} className="hall-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>

            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`form-input ${formData.name ? 'has-value' : ''}`}
                />
                <label className="floating-label">Wedding Hall Name</label>
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  className={`form-select ${formData.region ? 'has-value' : ''}`}
                >
                  <option value=""></option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <label className="floating-label">Select Region / District</label>
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className={`form-input ${formData.phone_number ? 'has-value' : ''}`}
                  required
                />
                <label className="floating-label">Contact Phone Number</label>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group half-width">
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    className={`form-input ${formData.capacity ? 'has-value' : ''}`}
                  />
                  <label className="floating-label">Guest Capacity</label>
                </div>
              </div>

              <div className="input-group half-width">
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="price_per_seat"
                    value={formData.price_per_seat}
                    onChange={handleInputChange}
                    required
                    className={`form-input ${formData.price_per_seat ? 'has-value' : ''}`}
                  />
                  <label className="floating-label">Price per Seat (UZS)</label>
                </div>
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <select
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                  className={`form-select ${formData.owner_id ? 'has-value' : ''}`}
                >
                  <option value=""></option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.first_name} {owner.last_name}
                    </option>
                  ))}
                </select>
                <label className="floating-label">Assign Owner (Optional)</label>
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
                  <span className="upload-subtext">Upload multiple high-quality images of your hall</span>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
                className="file-input"
              />
            </div>

            {/* ✅ FIX: Use previewUrls for display */}
            {previewUrls.length > 0 && (
              <div className="images-grid">
                {previewUrls.map((imageUrl, index) => (
                  <div key={index} className={`image-card ${index === 0 ? 'main-image' : ''}`}>
                    <img src={imageUrl} alt={`Hall preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveImage(index)}
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
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/admin/halls")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Creating Hall...
                </>
              ) : (
                'Create Hall'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}