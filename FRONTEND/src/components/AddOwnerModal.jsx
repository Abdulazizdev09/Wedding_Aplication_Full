import React, { useState, useEffect } from 'react';
import { createOwner } from "../api/adminApi";
import './addOwnerModal.css';

export default function AddOwnerModal({ isOpen, onClose, onOwnerAdded }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        phone_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setFieldErrors({});
        } else {
            // Reset form when modal closes
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                password: '',
                phone_number: ''
            });
            setError(null);
            setFieldErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const errors = {};
        
        // Required field validation
        if (!formData.first_name.trim()) {
            errors.first_name = 'First name is required';
        }
        
        if (!formData.last_name.trim()) {
            errors.last_name = 'Last name is required';
        }
        
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters long';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }
        
        if (!formData.phone_number.trim()) {
            errors.phone_number = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone_number)) {
            errors.phone_number = 'Please enter a valid phone number';
        }
        
        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Clear field-specific error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        
        setLoading(true);
        setError(null);
        setFieldErrors({});

        try {
            // Trim whitespace from form data
            const cleanedData = {
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                username: formData.username.trim(),
                password: formData.password,
                phone_number: formData.phone_number.trim()
            };
            
            await createOwner(cleanedData);

            // Reset form
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                password: '',
                phone_number: ''
            });

            // Call parent callback to refresh owners list
            if (onOwnerAdded) {
                onOwnerAdded();
            }

            // Close modal
            onClose();
            
        } catch (err) {
            console.error('Error creating owner:', err);
            
            // Handle different types of errors
            if (err.response?.status === 409) {
                setError('Username already exists. Please choose a different username.');
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || 'Invalid data provided. Please check your inputs.');
            } else if (err.response?.status >= 500) {
                setError('Server error. Please try again later.');
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to create owner. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return; // Prevent closing while loading
        
        setFormData({
            first_name: '',
            last_name: '',
            username: '',
            password: '',
            phone_number: ''
        });
        setError(null);
        setFieldErrors({});
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !loading) {
            handleClose();
        }
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !loading) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, loading]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-container">
                <button
                    onClick={handleClose}
                    className="modal-close-btn"
                    disabled={loading}
                    title="Close"
                >
                    <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">Add New Owner</h2>
                        <p className="modal-subtitle">Create a new hall owner account</p>
                    </div>

                    {error && (
                        <div className="error-alert">
                            <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="error-text">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="owner-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    First Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${fieldErrors.first_name ? 'error' : ''}`}
                                    placeholder="Enter first name"
                                    disabled={loading}
                                />
                                {fieldErrors.first_name && (
                                    <p className="field-error">{fieldErrors.first_name}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Last Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${fieldErrors.last_name ? 'error' : ''}`}
                                    placeholder="Enter last name"
                                    disabled={loading}
                                />
                                {fieldErrors.last_name && (
                                    <p className="field-error">{fieldErrors.last_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Username <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                                placeholder="Enter username (min 3 characters)"
                                disabled={loading}
                            />
                            {fieldErrors.username && (
                                <p className="field-error">{fieldErrors.username}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Password <span className="required">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                                placeholder="Enter password (min 6 characters)"
                                disabled={loading}
                            />
                            {fieldErrors.password && (
                                <p className="field-error">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Phone Number <span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                className={`form-input ${fieldErrors.phone_number ? 'error' : ''}`}
                                placeholder="Enter phone number"
                                disabled={loading}
                            />
                            {fieldErrors.phone_number && (
                                <p className="field-error">{fieldErrors.phone_number}</p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn-cancel"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn-submit ${loading ? 'loading' : ''}`}
                            >
                                {loading ? (
                                    <span className="loading-content">
                                        <svg className="spinner" viewBox="0 0 24 24">
                                            <circle 
                                                className="spinner-track" 
                                                cx="12" 
                                                cy="12" 
                                                r="10" 
                                                stroke="currentColor" 
                                                strokeWidth="4" 
                                                fill="none"
                                            />
                                            <path 
                                                className="spinner-fill" 
                                                fill="currentColor" 
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Owner'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}