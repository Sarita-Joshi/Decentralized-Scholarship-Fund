import React from 'react';
import './FeatureCard.css';

function FeatureCard({ title, content, image, onClick }) {
    return (
        <div className="feature-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="feature-card-icon">
                <img src={image} alt={title}/>
            </div>
            <h3 className="feature-card-title">{title}</h3>
            <p className="feature-card-content">{content}</p>
        </div>
    );
}

export default FeatureCard;
