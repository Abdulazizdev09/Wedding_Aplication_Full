import React, { useEffect, useState } from "react";
import { getMyHalls, deleteHall, editHall } from "../../api/ownerApi"; // use owner API
import ConfirmationModal from "../../components/ConfirmationModal";
import OwnerHallEditModal from "../../components/OwnerHallEditModal/OwnerHallEditModal";

import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  Building2,
  Edit2,
} from "lucide-react";
import "../admin/allHalls.css"; // reuse styling or create a new css file if needed

export default function MyHalls() {
  const [halls, setHalls] = useState([]);
  const [rawHalls, setRawHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hallToDelete, setHallToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [hallToEdit, setHallToEdit] = useState(null);

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

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sortField, sortOrder, filterRegion, filterStatus, rawHalls]);

  const fetchHalls = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching halls...");
      const data = await getMyHalls();
      
      // Enhanced debugging
      console.log("API Response:", data);
      console.log("Type of data:", typeof data);
      console.log("Is array:", Array.isArray(data));
      
      // Handle different response structures
      let hallsArray = [];
      
      if (Array.isArray(data)) {
        hallsArray = data;
      } else if (data && Array.isArray(data.halls)) {
        // If API returns { halls: [...] }
        hallsArray = data.halls;
      } else if (data && Array.isArray(data.data)) {
        // If API returns { data: [...] }
        hallsArray = data.data;
      } else if (data && data.success && Array.isArray(data.data)) {
        // If API returns { success: true, data: [...] }
        hallsArray = data.data;
      } else {
        console.warn("Unexpected API response format:", data);
        hallsArray = [];
      }
      
      console.log("Processed halls array:", hallsArray);
      console.log("Number of halls:", hallsArray.length);
      
      setRawHalls(hallsArray);
    } catch (err) {
      console.error("Error fetching halls:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      
      setError(err.response?.data?.message || err.message || "Failed to fetch halls");
      setRawHalls([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log("Applying filters with raw halls:", rawHalls);
    
    // Add safety check to ensure rawHalls is an array
    if (!Array.isArray(rawHalls)) {
      console.warn("rawHalls is not an array:", rawHalls);
      setHalls([]);
      return;
    }

    let filtered = [...rawHalls];
    console.log("Starting with halls:", filtered.length);

    if (filterRegion) {
      filtered = filtered.filter((h) => h.region === filterRegion);
      console.log("After region filter:", filtered.length);
    }
    
    if (filterStatus) {
      filtered = filtered.filter((h) => h.status === filterStatus);
      console.log("After status filter:", filtered.length);
    }

    if (searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), "i");
      filtered = filtered.filter((h) => regex.test(h.name));
      console.log("After search filter:", filtered.length);
    }

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        // Convert to number for numeric fields
        if (sortField === "price_per_seat" || sortField === "capacity") {
          aVal = Number(aVal) || 0;
          bVal = Number(bVal) || 0;
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    console.log("Final filtered halls:", filtered.length);
    setHalls(filtered);
  };

  const handleDeleteClick = (hall) => {
    setHallToDelete(hall);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!hallToDelete) return;

    setIsDeleting(true);
    try {
      await deleteHall(hallToDelete.id);
      setRawHalls((prev) => Array.isArray(prev) ? prev.filter((h) => h.id !== hallToDelete.id) : []);
      setHalls((prev) => Array.isArray(prev) ? prev.filter((h) => h.id !== hallToDelete.id) : []);
      setShowDeleteModal(false);
      setHallToDelete(null);
    } catch (err) {
      console.error("Error deleting hall:", err);
      setError(err.response?.data?.message || "Failed to delete hall");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalClose = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setHallToDelete(null);
    }
  };

  const handleEditClick = (hall) => {
    setHallToEdit(hall);
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setHallToEdit(null);
  };

  const handleEditConfirm = async (updatedHallData) => {
    try {
      await editHall(hallToEdit.id, updatedHallData);
      await fetchHalls();
      setShowEditModal(false);
      setHallToEdit(null);
    } catch (err) {
      console.error("Error updating hall:", err);
      setError(err.response?.data?.message || "Failed to update hall");
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

  // Debug info - remove this in production
  console.log("Current state:", {
    loading,
    error,
    rawHallsLength: rawHalls.length,
    hallsLength: halls.length,
    searchTerm,
    filterRegion,
    filterStatus
  });

  return (
    <div className="admin-halls-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="admin-icon">
            <Building2 size={24} />
          </div>
          <div className="admin-title-group">
            <h1 className="admin-title">My Wedding Halls</h1>
            <span className="admin-count">{Array.isArray(rawHalls) ? rawHalls.length : 0} total</span>
          </div>
        </div>
        <div className="admin-header-right">
          {/* Debug info - remove in production */}
          <div style={{ fontSize: '12px', color: '#666' }}>
            Raw: {rawHalls.length} | Filtered: {halls.length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search halls..."
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
              <option value="confirmed">Confirmed</option>
              <option value="unconfirmed">Unconfirmed</option>
            </select>
          </div>

          <div className="sort-buttons">
            <button
              onClick={() => handleSortChange("price_per_seat")}
              className={`sort-btn ${sortField === "price_per_seat" ? "active" : ""}`}
              aria-label="Sort by price per seat"
              title="Sort by price per seat"
            >
              <DollarSign size={16} />
              {sortField === "price_per_seat" && (
                <ArrowUpDown size={14} className={sortOrder === "desc" ? "rotate-180" : ""} />
              )}
            </button>
            <button
              onClick={() => handleSortChange("capacity")}
              className={`sort-btn ${sortField === "capacity" ? "active" : ""}`}
              aria-label="Sort by capacity"
              title="Sort by capacity"
            >
              <Users size={16} />
              {sortField === "capacity" && (
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
          <button 
            onClick={fetchHalls}
            style={{ marginTop: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading halls...</p>
          </div>
        ) : halls.length === 0 && !error ? (
          <div className="empty-state">
            <Building2 size={48} />
            <p>No halls found</p>
            {rawHalls.length === 0 && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                You haven't created any halls yet or there was an issue loading them.
              </p>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="halls-table">
              <thead>
                <tr>
                  <th>Hall Details</th>
                  <th>Location</th>
                  <th>Pricing</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {halls.map((hall) => (
                  <tr key={hall.id}>
                    <td>
                      <div className="hall-cell">
                        <div className="hall-avatar">
                          <Building2 size={20} />
                        </div>
                        <div className="hall-info">
                          <span className="hall-name">{hall.name}</span>
                          <span className="hall-id">ID: {hall.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-cell">
                        <MapPin size={16} />
                        <span>{hall.region}</span>
                      </div>
                    </td>
                    <td>
                      <div className="price-cell">
                        <span className="price-amount">{Number(hall.price_per_seat).toLocaleString()}</span>
                        <span className="price-unit">so'm/seat</span>
                      </div>
                    </td>
                    <td>
                      <div className="capacity-cell">
                        <Users size={16} />
                        <span>{hall.capacity}</span>
                      </div>
                    </td>
                    <td>
                      <div className={`status-badge ${hall.status === "confirmed" ? "confirmed" : "unconfirmed"}`}>
                        <CheckCircle size={14} />
                        <span>{hall.status.charAt(0).toUpperCase() + hall.status.slice(1)}</span>
                      </div>
                    </td>
                    
                    <td className="actions-cell">
                      <button
                        onClick={() => handleEditClick(hall)}
                        className="edit-btn"
                        aria-label={`Edit hall ${hall.name}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(hall)}
                        className="delete-btn"
                        aria-label={`Delete hall ${hall.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Wedding Hall"
        message={`Are you sure you want to delete "${hallToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Hall"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="danger"
      />

      {/* Owner Hall Edit Modal */}
      {showEditModal && hallToEdit && (
        <OwnerHallEditModal
          isOpen={showEditModal}
          onClose={handleEditCancel}
          onConfirm={handleEditConfirm}
          hall={hallToEdit}
          regions={regions}
          isLoading={false}
        />
      )}
    </div>
  );
}
