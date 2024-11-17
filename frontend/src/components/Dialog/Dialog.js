import React from 'react';
import './Dialog.css';

const Dialog = ({ title, children, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel" }) => {
    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h2>{title}</h2>
                <div className="dialog-body">
                    {children}
                </div>
                <div className="dialog-buttons">
                    <button onClick={onConfirm} className="confirm-btn">{confirmLabel}</button>
                    <button onClick={onCancel} className="cancel-btn">{cancelLabel}</button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
