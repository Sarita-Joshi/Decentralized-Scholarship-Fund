import React, { useState, useEffect } from 'react';
import ApplicantTable from '../components/ApplicantTable/ApplicantTable'; // Import ApplicantTable
import Footer from '../components/Footer/Footer'; // Import ApplicantTable

import './ReviewerPage.css';
import { approveApplication, getUserAccount } from "../contractUtils";
import { updateAppStatus, getAllApplications, getMetricsMongo } from '../dbUtils';

function ReviewerPage() {
    const [applications, setApplications] = useState([]);
    const [account, setAccount] = useState(null);
    const [metrics, setMetrics] = useState(0);
    // Fetch applications on load
    useEffect(() => {
        const loadApplications = async () => {
            const userAccount = await getUserAccount();
            const appData = await getAllApplications();
            setApplications(appData); // Set all applications
            setAccount(userAccount);
            
            const metrics_ = await getMetricsMongo();
            setMetrics(metrics_);

        };
        loadApplications();
    }, []);

    // Handle application status updates
    const handleStatusChange = async (applicantId, mongoHash, status) => {
      console.log({applicantId, mongoHash, status}) ; 
      const response = await approveApplication(applicantId, status);
        
          if (response.success) {
            let newStatus = response.status;
      
            // Check if the application was auto-disbursed
            if (response.autoDisbursed) {
              newStatus = "Funded";
            }
            console.log({applicantId, mongoHash, newStatus, status});
      
            // Update MongoDB with the new status
            await updateAppStatus(mongoHash, newStatus, account);

            // Update the frontend state
            setApplications((prevApps) =>
                prevApps.map((app) =>
                  app._id === mongoHash ? { ...app, status: newStatus } : app
              )
              );
          } else {
            console.error(response.message);
          }
    };

    const actions = {
        approve: async (row) => {
            alert(`Approving application ID: ${row._id}`);
            const app = applications.find((app) => app._id === row._id);
            await handleStatusChange(app.applicantId, app._id, 'Approved');

        },
      
        reject: async (row) => {
          alert(`Approving application ID: ${row._id}`);
            const app = applications.find((app) => app._id === row._id);
            await handleStatusChange(app.applicantId, app._id, "Rejected");
        }
      };

    return (
        <div className="reviewer-page">
            {/* Top Ribbon with Profile and Stats */}
            <div className="donor-ribbon">
                <div className="profile-section">
                    <img
                        src="https://via.placeholder.com/100" // Replace with actual avatar
                        alt="Donor Avatar"
                        className="donor-avatar"
                    />
                    <div className="profile-details">
                        <h3>John Doe</h3>
                        <p>Email: john.doe@example.com</p>
                        <p>Address: <strong>{account}</strong></p>
                    </div>
                </div>
                <div className="stats-section">
                    <div className="stat-card">
                        <p className='badge badge1'>Total Approved</p>
                        <h3>{metrics.approvedApplications+metrics.fundedApplications}</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge2'>Application Amount</p>
                        <h3>{metrics.totalApplicationAmount} ETH</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge3'>Rejected Applications</p>
                        <h3>{metrics.rejectedApplications}</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge4'>Pending Applications</p>
                        <h3>{metrics.pendingApplications}</h3>
                    </div>
                </div>
                
            </div>
            {/* ApplicantTable Component */}
            <ApplicantTable
                data={applications}
                actions={actions}
                filters={{ showSearch: true, showSort: true, showFilter: true}} // Enable all filters
            />

            <Footer />
        </div>
    );
}

export default ReviewerPage;
