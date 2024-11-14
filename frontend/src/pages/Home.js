import React, { useState } from 'react';
import LoginModal from '../components/LoginModal';

function Home() {
    const [showLogin, setShowLogin] = useState(false);
    const [role, setRole] = useState(null);

    const handleLoginClick = async (selectedRole) => {
        
        setRole(selectedRole);
        setShowLogin(true);
    };


    const closeLoginModal = () => {
        setShowLogin(false);
        setRole(null);
    };

    return (
        <div>
            <h1>Welcome to the Scholarship Fund</h1>
            <p>Select your role to proceed:</p>
            <button onClick={() => handleLoginClick("applicant")}>Applicant</button><br />
            <button onClick={() => handleLoginClick("donor")}>Donor</button><br />
            <button onClick={() => handleLoginClick("reviewer")}>Reviewer</button><br />
            <button onClick={() => handleLoginClick("owner")}>Owner</button><br />

            {showLogin && <LoginModal role={role} closeModal={closeLoginModal} />}
        </div>
    );
}

export default Home;
