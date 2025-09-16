import React, { useEffect, useState } from "react";
import { getHalls, deleteHall, editHall, getOwners } from "../../api/adminApi";
import ConfirmationModal from "../../components/ConfirmationModal";
import EditHallModal from "../../components/EditHallModal";
import "./allHalls.css"

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
  Plus,
  Edit2,
} from "lucide-react";
import "./allHalls.css";

export default function AllHalls() {
  const [halls, setHalls] = useState([]);
  const [rawHalls, setRawHalls] = useState([]);
  const [owners, setOwners] = useState([]);
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
    fetchOwners();
    fetchHalls();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sortField, sortOrder, filterRegion, filterStatus, rawHalls]);

  const fetchOwners = async () => {
    try {
      const data = await getOwners();
      setOwners(data);
    } catch (err) {
      // Handle owner fetch error silently or show error if desired
    }
  };

  const fetchHalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHalls();
      setRawHalls(data.halls || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch halls");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rawHalls];

    if (filterRegion) filtered = filtered.filter((h) => h.region === filterRegion);
    if (filterStatus) filtered = filtered.filter((h) => h.status === filterStatus);

    if (searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), "i");
      filtered = filtered.filter((h) => regex.test(h.name));
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
      setRawHalls((prev) => prev.filter((h) => h.id !== hallToDelete.id));
      setHalls((prev) => prev.filter((h) => h.id !== hallToDelete.id));
      setShowDeleteModal(false);
      setHallToDelete(null);
    } catch (err) {
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

  const getOwnerName = (owner_id) => {
    const owner = owners.find((o) => o.id === owner_id);
    return owner ? `${owner.first_name} ${owner.last_name || ""}`.trim() : "-";
  };

  return (
    <div className="admin-halls-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="admin-icon">
            <Building2 size={24} />
          </div>
          <div className="admin-title-group">
            <h1 className="admin-title">Wedding Halls</h1>
            <span className="admin-count">{rawHalls.length} total</span>
          </div>
        </div>
        <div className="admin-header-right">
          <button className="add-hall-btn">
            <Plus size={20} />
            Add Hall
          </button>
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
        </div>
      )}

      {/* Table Container */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading halls...</p>
          </div>
        ) : halls.length === 0 ? (
          <div className="empty-state">
            <Building2 size={48} />
            <p>No halls found</p>
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
                  <th>Phone Number</th> {/* Added Phone Number header */}
                  <th>Status</th>
                  <th>Owner</th>
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
                    <td> {/* Added Phone Number data cell */}
                      <span className="phone-number-cell">{hall.phone_number || 'N/A'}</span>
                    </td>
                    <td>
                      <div className={`status-badge ${hall.status === "confirmed" ? "confirmed" : "unconfirmed"}`}>
                        <CheckCircle size={14} />
                        <span>{hall.status.charAt(0).toUpperCase() + hall.status.slice(1)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="owner-name">{getOwnerName(hall.owner_id)}</span>
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

      {/* Edit Hall Modal */}
      {showEditModal && hallToEdit && (
        <EditHallModal
          isOpen={showEditModal}
          onClose={handleEditCancel}
          onConfirm={handleEditConfirm}
          hall={hallToEdit}
          regions={regions}
          owners={owners}
          isLoading={false}
        />
      )}
    </div>
  );
}