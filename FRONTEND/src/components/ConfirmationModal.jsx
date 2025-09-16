import React from 'react';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import './confirmationModal.css';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  type = "danger" // "danger", "warning", "info"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="confirmation-modal-overlay"
      onClick={!isLoading ? onClose : undefined}
    >
      <div 
        className={`confirmation-modal-content ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={!isLoading ? onClose : undefined}
          className="close-button"
          disabled={isLoading}
        >
          <X size={16} />
        </button>
        
        <div className="modal-body">
          <div className={`icon-container ${type}`}>
            {type === 'danger' ? (
              <Trash2 size={24} className="modal-icon" />
            ) : (
              <AlertTriangle size={24} className="modal-icon" />
            )}
          </div>
          <div className="content-container">
            <h3 className="modal-title">{title}</h3>
            <p className="modal-message">{message}</p>
          </div>
        </div>
        
        <div className="modal-actions">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cancel-button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`confirm-button ${type}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="loading-spinner" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;