import React from 'react';
import './Footer.css';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import logo from '../../assets/logo2.png';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Left Section - Logo and Info */}
                <div className="footer-section">
                    <img src={logo} alt="EduFund Logo" className="footer-logo" />
                    <p>A Decentralized Academic Publishing System</p>
                    <p>Using Smart Contract</p>
                </div>

                {/* Middle Section - Product and Legal Links */}
                <div className="footer-links">
                    <div>
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#how-it-works">How it works</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#use-cases">Use Cases</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#privacy">Privacy</a></li>
                            <li><a href="#terms">Terms</a></li>
                            <li><a href="#license">License</a></li>
                        </ul>
                    </div>
                </div>

                {/* Right Section - Social Media Icons */}
                <div className="footer-social">
                    <p>© 2024 EduFund. All rights reserved.</p>
                    <div className="social-icons">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
