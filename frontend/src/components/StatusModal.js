import React from 'react';
import Confetti from 'react-confetti';
import './StatusModal.css';

function StatusModal({ status, onClose }) {
    // Determine modal content based on the status
    const getContent = () => {
        switch (status) {
            case 'Approved':
                return {
                    message: "Congratulations! Your application is approved!",
                    image: 'approved_image_url', // Replace with celebratory image URL
                    quote: '',
                    showConfetti: true
                };
            case 'Rejected':
                return {
                    message: "Unfortunately, your application was not approved.",
                    image: 'rejected_image_url', // Replace with sad image URL
                    quote: "Don't lose faith! Try harder next time. All the best!",
                    showConfetti: false
                };
            case 'Pending':
                return {
                    message: "Your application is still pending.",
                    image: 'pending_image_url', // Replace with waiting/pending image URL
                    quote: "Don't lose faith! We’ll get back to you soon.",
                    showConfetti: false
                };
            default:
                return null;
        }
    };

    const content = getContent();

    if (!content) return null;

    return (
        <div className="status-modal-overlay">
            <div className="status-modal">
                {content.showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                
                <button className="close-button" onClick={onClose}>X</button>
                
                <h2>{content.message}</h2>
                
                <img src={content.image} alt={`${status} illustration`} className="status-image" />
                
                {content.quote && <p className="quote">{content.quote}</p>}
            </div>
        </div>
    );
}

export default StatusModal;
