import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./pages/Home";
import ApplicantPage from "./pages/ApplicantPage";
import DonorPage from "./pages/DonorPage";
import ReviewerPage from "./pages/ReviewerPage";
import OwnerPage from "./pages/OwnerPage";
import FundOwnerPage from "./pages/FundOwnerDashboard/FundOwnerDashboard";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/applicant"
            element={
              <ProtectedRoute requiredRole="applicant">
                <ApplicantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/reviewer" element={<ProtectedRoute requiredRole="reviewer">
            <ReviewerPage />
          </ProtectedRoute>} />
          
          <Route
            path="/owner"
            element={
              <ProtectedRoute requiredRole="owner">
                <OwnerPage />
              </ProtectedRoute>
            }
          />
          <Route path="/fund-owner" element={<FundOwnerPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
