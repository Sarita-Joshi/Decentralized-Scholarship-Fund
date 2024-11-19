import React from 'react';
import './FundCard.css';
import random from 'random';
import one from '../../assets/banners/1.jpg';
import two from '../../assets/banners/2.jpg';
import three from '../../assets/banners/3.jpg';
import four from '../../assets/banners/4.jpg';

const FundCard = ({
    banner,
    title,
    subtitle,
    totalFunds,
    totalApplicants,
    fundsNeeded,
    onDonate,
}) => {

    const banners = [one, two, three, four];

    const generate_banner = (banner) => {
        if (banner) {
            return banner;
        }
        return banners[random.int(1,4)-1];
    };


    return (
        <div className="fund-card">
            <img src={generate_banner(banner)} alt={`${title} Banner`} className="fund-banner" />
            <div className="fund-details">
                <h3>{title}</h3>
                <p className="fund-subtitle">{subtitle}</p>
                <div className="fund-stats">
                    <p>
                        <strong>Total Funds:</strong> {totalFunds} ETH
                    </p>
                    <p>
                        <strong>Total Applications:</strong> {totalApplicants}
                    </p>
                    <p>
                        <strong>Funds Needed:</strong> {fundsNeeded} ETH
                    </p>
                </div>
                <button className="donate-btn" onClick={onDonate}>
                    Donate Now
                </button>
            </div>
        </div>
    );
};

export default FundCard;
