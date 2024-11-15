import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
import { connectWallet } from "../contractUtils";


function LoginModal({ role, closeModal }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();

    // Predefined credentials for each role
    const credentials = {
        applicant: { username: "applicant", password: "app123" },
        donor: { username: "donor", password: "don123" },
        reviewer: { username: "reviewer", password: "rev123" },
        owner: { username: "owner", password: "own123" }
    };

    // Function to authenticate username and password
    const authenticateUser = () => {
        console.log({role});
        const roleCredentials = credentials[role];
        if (username === roleCredentials.username && password === roleCredentials.password) {
            return true;
        } else if (username === credentials.owner.username && password === credentials.owner.password) {
            role = 'owner';
            return true;
        }  else {
            setError('Invalid credentials, please try again.');
            return false;
        }
    };

    // Function to connect to MetaMask
    const connectMetamask = async () => {
        try {
            const userAccount = await connectWallet();
            if (!userAccount) {
                alert("Failed to connect to MetaMask. Please try again.");
                return false;
            }
            setAccount(userAccount);
            return true;
        } catch (error) {
            setError("Failed to connect MetaMask.");
            return false;
        }
        
    };

    // Handle login with MetaMask connection
    const handleLogin = async (e) => {
        e.preventDefault();
        const isAuthenticated = authenticateUser();
        if (isAuthenticated) {
            const isWalletConnected = await connectMetamask();
            if (isWalletConnected) {
                // Navigate to the respective page based on role
                if (role === 'applicant') navigate('/applicant');
                else if (role === 'donor') navigate('/donor');
                else if (role === 'reviewer') navigate('/reviewer');
                else if (role === 'owner') navigate('/owner');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <button onClick={closeModal} className="close-button">Cancel</button>
                {account && <p>Connected account: {account}</p>}
            </div>
        </div>
    );
}

export default LoginModal;
