import React from 'react';
import './ProfileModal.css';

const ProfileModal = ({ profile, onClose }) => {
    if (!profile) return null;

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="profile-modal-overlay">
            <div className="profile-modal">
                <div className="modal-header">
                    <h2>Candidate Profile</h2>
                    
                </div>

                <div className="profile-modal-content">
                    {/* Left Section */}
                    <div className="profile-left">
                        <div className="profile-picture">
                            <img
                                src="https://via.placeholder.com/100" // Replace with actual profile image if available
                                alt="Profile"
                            />
                        </div>
                        <div className="profile-basic-info">
                            <p><strong>Full Name:</strong> {profile.fullName}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Phone:</strong> {profile.phoneNumber}</p>
                            <p><strong>Institution:</strong> {profile.institution}</p>
                            <p><strong>Program:</strong> {profile.program}</p>
                            <p><strong>Year:</strong> {profile.year}</p>
                            <p><strong>GPA:</strong> {profile.gpa}</p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="profile-right">
                        <div className="profile-details">
                            <p><strong>Requested Amount:</strong> ${profile.requestedAmount}</p>
                            <p><strong>Status:</strong> {profile.status}</p>
                            <p><strong>Application Date:</strong> {formatDate(profile.createdAt)}</p>
                            <p><strong>Last Updated:</strong> {formatDate(profile.updatedAt)}</p>
                        </div>
                        <div className="profile-statement">
                            <p><strong>Reason for Funding:</strong></p>
                            <p>{profile.reason}</p>
                            <p><strong>Personal Statement:</strong></p>
                            <p>{profile.personalStatement}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-modal-footer">
                    <button className="close-btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
