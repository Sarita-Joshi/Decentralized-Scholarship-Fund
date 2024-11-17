import React, { useState, useEffect } from 'react';
import ApplicantTable from '../components/ApplicantTable/ApplicantTable'; // Import ApplicantTable
import Footer from '../components/Footer/Footer'; // Import ApplicantTable

import './ReviewerPage.css';
import { approveApplication, getUserAccount } from "../contractUtils";
import { updateAppStatus, getAllApplications } from '../dbUtils';

function ReviewerPage() {
    const [applications, setApplications] = useState([]);
    const [account, setAccount] = useState(null);
    const [highestDonation, setHighestDonation] = useState(0);
    const [noOfFunds, setNoOfFunds] = useState(3); // Example static value
    const [noOfDonations, setNoOfDonations] = useState(0);

    // Fetch applications on load
    useEffect(() => {
        const loadApplications = async () => {
            const userAccount = await getUserAccount();
            const appData = await getAllApplications();
            setApplications(appData); // Set all applications
            setAccount(userAccount);
        };
        loadApplications();
    }, []);

    // Handle application status updates
    const handleStatusChange = async (id, mongoHash, newStatus) => {
        console.log({id, mongoHash, newStatus})
        const result = await approveApplication(id, newStatus);
        alert(result.message);

        if (result.success) {
            await updateAppStatus(mongoHash, newStatus);
            setApplications((prevApps) =>
                prevApps.map((app) =>
                    app._id === mongoHash ? { ...app, status: newStatus } : app
                )
            );
        }
    };

    // Actions for approve/reject buttons
    const actions = {
        approve: async (row) => {
            alert(`Approving application ID: ${row._id}`);
            const appplicant = applications.filter(item => item._id === row._id)[0];
            console.log(appplicant);
            // Here you would implement the logic to approve this application
            await handleStatusChange(appplicant.applicantId, appplicant._id, 'Approved');
        },
        reject: async (row) => {
            alert(`Approving application ID: ${row._id}`);
            const appplicant = applications.filter(item => item._id === row._id);
            // Here you would implement the logic to approve this application
            await handleStatusChange(appplicant.applicantId, appplicant._id, 'Approved');
        },
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
                        <p>Address: <strong>0xABC123...XYZ</strong></p>
                    </div>
                </div>
                <div className="stats-section">
                    <div className="stat-card">
                        <p className='badge badge1'>Total Approved</p>
                        <h3>{noOfDonations}</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge2'>Approved Amount</p>
                        <h3>{noOfDonations} ETH</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge3'>Rejected Applications</p>
                        <h3>{noOfFunds}</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge4'>Pending Applications</p>
                        <h3>{highestDonation} ETH</h3>
                    </div>
                </div>
                
            </div>
            {/* ApplicantTable Component */}
            <ApplicantTable
                data={applications}
                actions={actions}
                filters={{ showSearch: true, showSort: true, showFilter: true }} // Enable all filters
            />

            <Footer />
        </div>
    );
}

export default ReviewerPage;
