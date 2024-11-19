import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ApplicantPage from './pages/ApplicantPage';
import DonorPage from './pages/DonorPage';
import ReviewerPage from './pages/ReviewerPage';
import OwnerPage from './pages/OwnerPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/applicant" element={<ApplicantPage />} />
                <Route path="/donor" element={<DonorPage />} />
                <Route path="/reviewer" element={<ReviewerPage />} />
                <Route path="/owner" element={<OwnerPage />} />
            </Routes>
        </Router>
    );
}

export default App;
