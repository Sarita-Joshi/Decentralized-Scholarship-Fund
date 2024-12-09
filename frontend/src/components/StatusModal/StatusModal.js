import React from 'react';
import Lottie from "lottie-react";
import './StatusModal.css';
import celebrationAnimationData from '../../assets/celebration.json'; // Example Lottie file
import start from '../../assets/status/start.gif';
import approved from '../../assets/status/approved.gif';
import pending from '../../assets/status/pending.gif';
import rejected from '../../assets/status/rejected.webp';
import success from '../../assets/status/success.gif';
import donated from '../../assets/status/donated.gif';

function StatusModal({ status, onClose }) {
    // Determine modal content based on the status
    const getContent = () => {
        switch (status) {
            case 'Approved':
                return {
                    message: "Congratulations! Your application is approved!",
                    image: approved, // Replace with celebratory image URL
                    quote: '',
                    showCelebration: true
                };
            case 'Rejected':
                return {
                    message: "Unfortunately, your application was not approved.",
                    image: rejected, // Replace with sad image URL
                    quote: "Don't lose faith! Try harder next time. All the best!",
                    showCelebration: false
                };
            case 'Pending':
                return {
                    message: "Your application is still pending.",
                    image: pending, // Replace with waiting/pending image URL
                    quote: "Don't lose faith! We’ll get back to you soon.",
                    showCelebration: false
                };
            case 'Funded':
                return {
                    message: "Hurrey! Your application has been Funded.",
                    image: approved, 
                    quote: "Yey! Make the best of this opportunity.",
                    showCelebration: false
                };
            default:
                return {
                    message: "You do not have an active application. Start Now!",
                    image: start, // Replace with no application image URL
                    quote: "Start your first application!",
                    showCelebration: false
                };
        }
    };

    const content = getContent();

    const celebrationOptions = {
        loop: false,
        autoplay: true,
        animationData: celebrationAnimationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className="status-modal-overlay">
            <div className="status-modal">
                {content.showCelebration && (
                    <Lottie options={celebrationOptions} height={150} width={150} />
                )}
                
                <button className="close-button" onClick={onClose}>X</button>
                
                <h2>{content.message}</h2>
                
                <img src={content.image} alt={`${status} illustration`} className="status-image" />
                
                {content.quote && <p className="quote">{content.quote}</p>}
            </div>
        </div>
    );
}

export default StatusModal;
