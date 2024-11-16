import React, { useState } from 'react';
import LoginModal from '../components/LoginModal';
import './Home.css';
import FeatureCard from '../components/FeatureCard/FeatureCard';
import transparentIcon from '../assets/transparency.png';
import anonymousIcon from '../assets/anonymous.png';
import smartContractsIcon from '../assets/ethereum.png';
import { FcDisclaimer } from 'react-icons/fc';
import Footer from '../components/Footer/Footer';
import logo from '../assets/logo2.png';
import homegif from '../assets/Research paper.gif';
import approvergif from '../assets/approver.gif';
import donorgif from '../assets/donor.gif';
import applgif from '../assets/appl.gif';

function Home() {
    const [showLogin, setShowLogin] = useState(false);

    const [role, setRole] = useState('Applicant');

    const handleLoginClick = async (selectedRole) => {
        
        setRole(selectedRole);
        setShowLogin(true);
        console.log({showLogin, role});
    };


    const closeLoginModal = () => {
        setShowLogin(false);
        setRole(null);
    };

    return (
        <div className="home-page">
        
        <div className='decorative-shape shape1'></div>
        <div className='decorative-shape shape2'></div>
        <div className='decorative-shape shape3'></div>
        
        {/* Header Section */}
        <header className="header">
            <div className="logo">
                <img src={logo} alt="EduFund Logo" className="logo" />
                <h2 className="title">
                    <a href="/">EduFund</a>
                </h2>

            </div>
            <button className="metamask-button" onClick={() => handleLoginClick("applicant")}>Connect Metamask</button>
        </header>

{/* Hero Section */}
<section className="hero-section">
<div className="hero-content">
        <h1 className="hero-title">EduFund</h1>
        <p className="hero-subtitle">
            A new way for <span className="highlight">academic funding</span>.<br />
            Say hello 👋 to our new <span className="highlight">Decentralized</span> scholarship platform.
        </p>
        <button className="metamask-button" onClick={() => handleLoginClick("applicant")}>Get Started</button>
    </div>
    <div className="hero-image">
        <img src={homegif} alt="Educational Platform" />
    </div>
</section>



            {/* Role Cards Section */}
            <section className="role-section">
                <h2 className="h22">Get Started with EduFund</h2>
                <div className="roles-div">
                <FeatureCard 
                    title="Applicant"
                    content="Apply for scholarships to support your education."
                    image={applgif}
                    onClick={() => handleLoginClick("applicant")}
                />
                <FeatureCard 
                    title="Donor"
                    content="Make a difference by funding a student’s dreams."
                    image={donorgif}
                    onClick={() => handleLoginClick("donor")}
                />
                <FeatureCard 
                    title="Reviwer"
                    content="Review applications and help select deserving students."
                    image={approvergif}
                    onClick={() => handleLoginClick("reviwer")}
                />
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="h22">Features</h2>
                <div className="features-div">
                <FeatureCard 
                title="Transparent"
                content="We offer a transparent peer review process. Your work is visible to all and reviewed by trusted academics."
                image={transparentIcon}
            />
            <FeatureCard 
                title="Anonymous"
                content="The reviews are conducted anonymously. The information of the reviewers is private and safe with us."
                image={anonymousIcon}
            />
            <FeatureCard 
                title="Smart Contracts"
                content="We use smart contracts and the Ethereum blockchain to decentralize and automate our system."
                image={smartContractsIcon}
            />
                </div>
                
            </section>

            {/* Disclaimer Section */}
            <section className="disclaimer-section">
            
            
            <div className="disclaimer-content">
            
            <div className="disclaimer-icon">
                <FcDisclaimer size="2rem" />
                <h3 className="disclaimer-title">Disclaimer</h3>
            </div>
                
                <p className="disclaimer-text">
                    The data you provide us with does not persist on any server-side databases but is completely stored on the blockchain. We respect your privacy and strive to achieve the most secure system. Your data is safe.
                </p>

                </div>
                
            </section>

            {/* Footer Section */}
            <Footer />

            {showLogin && <LoginModal role={role} closeModal={closeLoginModal} />}
        </div>
    );
}

export default Home;
