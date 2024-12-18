import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
import { checkIfOwner, connectWallet, getUserAccount } from "../../contractUtils";
import { useAuth } from "../../AuthContext";

import { FaInfoCircle } from 'react-icons/fa';

function LoginModal({ role, closeModal }) {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [account, setAccount] = useState(null);
    const [termsChecked, setTermsChecked] = useState(false);
    const [metaMaskChecked, setMetaMaskChecked] = useState(false);
    const [selectedRole, setSelectedRole] = useState(role);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const credentials = {
        applicant: { username: "applicant", password: "app123" },
        donor: { username: "donor", password: "don123" },
        reviewer: { username: "reviewer", password: "rev123" },
        owner: { username: "owner", password: "own123" }
    };

    // Fetch applications on load
    useEffect(() => {
        const loadApplications = async () => {
            const userAccount = await getUserAccount();
            if (userAccount){
                setAccount(userAccount);
                setMetaMaskChecked(true);
            }
        };
        loadApplications();
    }, [metaMaskChecked]);

    const authenticateUser = async () => {
        console.log([selectedRole, account]);
        if (selectedRole === "owner") {
            console.log(["HIIIIIIII"]);
            const isOwner = await checkIfOwner(account);
            console.log([isOwner, account])
            if (!isOwner) {
                alert("Warning - Owner Account Not Found. Please try a different role or connect different wallet.");
                return false;
            }
        }
        login(selectedRole, account);
        return true
    };

    const connectMetamask = async () => {
        try {
            let userAccount, message = await connectWallet();
            if (!userAccount) {
                alert(message);
                return false;
            }
            setAccount(userAccount);
            setMetaMaskChecked(true);
            return true;
        } catch (error) {
            setError("Failed to connect MetaMask.");
            return false;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const isAuthenticated = await authenticateUser();
        if (isAuthenticated && termsChecked && metaMaskChecked) {
            if (selectedRole === 'applicant') navigate('/applicant');
            else if (selectedRole === 'donor') navigate('/donor');
            else if (selectedRole === 'reviewer') navigate('/reviewer');
            else if (selectedRole === 'owner') navigate('/owner');
        } else if (!termsChecked || !metaMaskChecked) {
            setError('Please agree to terms and ensure MetaMask is connected.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="h22">Connect To MetaMask</h2>

                <div className="custom-dropdown" onClick={() => setShowDropdown(!showDropdown)}>
                    <span>As {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                    {showDropdown && (
                        <ul className="dropdown-options">
                            {Object.keys(credentials).map((key) => (
                                <li key={key} onClick={() => { setSelectedRole(key); setShowDropdown(false); }}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <form onSubmit={handleLogin}>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={termsChecked}
                                onChange={(e) => setTermsChecked(e.target.checked)}
                            />
                            I agree to the Terms and Conditions
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={metaMaskChecked}
                                disabled={!account}
                            />
                            Connected to MetaMask
                            <span className="info-icon">
                                <FaInfoCircle />
                                <span className="tooltip">
                                    <button onClick={connectMetamask} className="tooltip-button">
                                        Connect MetaMask
                                    </button>
                                </span>
                            </span>
                        </label>
                    </div>

                    <button type="submit">Continue</button>
                    {error && <p className="error-message">{error}</p>}

                <button onClick={closeModal} className="close-button">Cancel</button>
                {account && <p className="account-message">Connected account: {account.substring(0,10) + "..." + account.substring(account.length - 10)}</p>}

                </form>
                            </div>
        </div>
    );
}

export default LoginModal;
