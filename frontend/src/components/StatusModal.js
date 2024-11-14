import React from 'react';
import './StatusModal.css';

function StatusModal({ onClose, onCheckStatus, onNewApplication }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Scholarship Application</h2>
                <button onClick={onCheckStatus}>Check Application Status</button>
                <button onClick={onNewApplication}>Create New Application</button>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default StatusModal;
