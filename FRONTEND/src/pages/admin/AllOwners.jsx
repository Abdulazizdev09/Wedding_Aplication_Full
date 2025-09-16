import React, { useEffect, useState } from "react";
import { getOwners } from "../../api/adminApi";
import AddOwnerModal from "../../components/AddOwnerModal";
import "./allOwners.css";

export default function AllOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState('first_name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOwners();
      setOwners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching owners:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch owners. Please try again."
      );
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerAdded = () => {
    fetchOwners();
  };

  const handleRetry = () => {
    fetchOwners();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOwners = [...owners].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    if (sortField === 'full_name') {
      aValue = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      bValue = `${b.first_name || ''} ${b.last_name || ''}`.trim();
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const filteredOwners = sortedOwners.filter((owner) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase().trim();
    const firstName = owner.first_name?.toLowerCase() || "";
    const lastName = owner.last_name?.toLowerCase() || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const hallsInfo = String(owner.halls_info || '').toLowerCase();
    const phoneNumber = owner.phone_number || "";

    return (
      firstName.includes(term) ||
      lastName.includes(term) ||
      fullName.includes(term) ||
      hallsInfo.includes(term) ||
      phoneNumber.includes(term)
    );
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const openAddOwnerModal = () => {
    setIsModalOpen(true);
  };

  const closeAddOwnerModal = () => {
    setIsModalOpen(false);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg className="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8 9l4-4 4 4M16 15l-4 4-4-4" strokeWidth={1.5} />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="sort-icon active" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M8 15l4-4 4 4" strokeWidth={2} />
      </svg>
    ) : (
      <svg className="sort-icon active" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M16 9l-4 4-4-4" strokeWidth={2} />
      </svg>
    );
  };

  return (
    <div className="crm-owners-container">
      {/* Header Section */}
      <div className="crm-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">Hall Owners</h1>
            <p className="page-subtitle">Manage and monitor all registered hall owners</p>
          </div>
          <button
            className="add-owner-btn"
            onClick={openAddOwnerModal}
            disabled={loading}
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Owner
          </button>
        </div>
      </div>

      {/* Search and Stats Section */}
      <div className="crm-toolbar">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search owners by name, phone, or halls..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              disabled={loading}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="clear-search-btn"
                title="Clear search"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">{owners.length}</span>
            <span className="stat-label">Total Owners</span>
          </div>
          {searchTerm && (
            <div className="stat-item">
              <span className="stat-value">{filteredOwners.length}</span>
              <span className="stat-label">Filtered Results</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="crm-content">
        {loading && (
          <div className="state-container loading-state">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
            </div>
            <h3 className="state-title">Loading Owners</h3>
            <p className="state-description">Please wait while we fetch the owner data...</p>
          </div>
        )}

        {error && (
          <div className="state-container error-state">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="state-title">Error Loading Owners</h3>
            <p className="state-description">{error}</p>
            <button
              onClick={handleRetry}
              className="retry-btn"
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredOwners.length === 0 && owners.length === 0 && (
          <div className="state-container empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="state-title">No Owners Yet</h3>
            <p className="state-description">Get started by adding your first hall owner</p>
            <button onClick={openAddOwnerModal} className="primary-btn">
              Add First Owner
            </button>
          </div>
        )}

        {!loading && !error && filteredOwners.length === 0 && owners.length > 0 && (
          <div className="state-container empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3 className="state-title">No Results Found</h3>
            <p className="state-description">No owners match your search criteria</p>
            <button onClick={clearSearch} className="secondary-btn">
              Clear Search
            </button>
          </div>
        )}

        {!loading && !error && filteredOwners.length > 0 && (
          <div className="table-container">
            <table className="owners-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('full_name')}>
                    <div className="th-content">
                      <span>Owner Name</span>
                      <SortIcon field="full_name" />
                    </div>
                  </th>
                  <th className="sortable" onClick={() => handleSort('phone_number')}>
                    <div className="th-content">
                      <span>Phone Number</span>
                      <SortIcon field="phone_number" />
                    </div>
                  </th>
                  <th className="sortable" onClick={() => handleSort('hall_count')}>
                    <div className="th-content">
                      <span>Halls Count</span>
                      <SortIcon field="hall_count" />
                    </div>
                  </th>
                  <th>Hall Names</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.map((owner) => (
                  <tr key={owner.id || owner.username} className="owner-row">
                    <td className="owner-name-cell">
                      <div className="owner-profile">
                        <div className="owner-avatar">
                          <span className="avatar-text">
                            {(owner.first_name?.[0] || owner.username?.[0] || 'O').toUpperCase()}
                          </span>
                        </div>
                        <div className="owner-info">
                          <div className="owner-name">
                            {owner.first_name && owner.last_name
                              ? `${owner.first_name} ${owner.last_name}`
                              : owner.first_name || owner.last_name || 'Unknown Name'
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="phone-cell">
                      {owner.phone_number ? (
                        <a href={`tel:${owner.phone_number}`} className="phone-link">
                          {owner.phone_number}
                        </a>
                      ) : (
                        <span className="na-text">N/A</span>
                      )}
                    </td>
                    <td className="count-cell">
                      <span className="halls-count-badge">{owner.hall_count ?? 0}</span>
                    </td>
                    <td className="halls-cell">
                      {(owner.halls_info && owner.halls_info.length > 0) ? (
                        <div className="halls-tags">
                          {Array.isArray(owner.halls_info) 
                            ? owner.halls_info.slice(0, 3).map((hall, index) => (
                                <span key={index} className="hall-tag">{hall}</span>
                              ))
                            : <span className="hall-tag">{owner.halls_info}</span>
                          }
                          {Array.isArray(owner.halls_info) && owner.halls_info.length > 3 && (
                            <span className="more-halls">+{owner.halls_info.length - 3} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="na-text">No halls</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddOwnerModal
        isOpen={isModalOpen}
        onClose={closeAddOwnerModal}
        onOwnerAdded={handleOwnerAdded}
      />
    </div>
  );
}
