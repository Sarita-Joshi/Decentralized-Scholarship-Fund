import React, { useState, useEffect } from 'react';
import RecordTable from '../components/RecordTable';
import './OwnerPage.css';
import { getAllApplications } from '../dbUtils';
import { disburseFunds, getUserAccount } from "../contractUtils";



function OwnerPage() {
    // Dummy summary metrics and data
    const summary = {
        totalApplicants: 120,
        totalApproved: 80,
        totalPending: 30,
        totalRejected: 10,
        totalDonations: "150 ETH",
        totalDonors: 50,
    };

    const [applications, setApplications] = useState([
        { id: 1, applicant: '0x1234...5678', amount: '0.5 ETH', status: 'Pending' },
        { id: 2, applicant: '0x2345...6789', amount: '1.2 ETH', status: 'Approved' },
        { id: 3, applicant: '0x3456...7890', amount: '0.8 ETH', status: 'Rejected' },
        { id: 4, applicant: '0x4567...8901', amount: '2.0 ETH', status: 'Pending' },
    ]);
    const [account, setAccount] = useState(null);

    // Fetch applications on load
    useEffect(() => {
        const loadApplications = async () => {
            const userAccount = await getUserAccount();
            const appData = await getAllApplications();
            //TODO filter and kee ponly pending applications
            setApplications(appData);
            setAccount(userAccount);
        };
        loadApplications();
    }, []);

    const donations = [
        { id: 1, donor: '0x1234...5678', amount: '0.5 ETH', date: '2024-01-10' },
        { id: 2, donor: '0x2345...6789', amount: '1.0 ETH', date: '2024-02-15' },
        { id: 3, donor: '0x3456...7890', amount: '0.3 ETH', date: '2024-03-05' },
        // more dummy data here
    ];

    // Columns for the tables
    const applicationColumns = ['_id', 'fullName', 'requestedAmount', 'status'];
    const donationColumns = ['id', 'donor', 'amount', 'date'];

    const applicationHeaders = ['Id', 'Applicant', 'Amount', 'Status'];
    const donationHeaders = ['Id', 'Donor', 'Amount', 'Date'];



    return (
        <div>
            <h2>Owner Dashboard</h2>
            <div className="summary-section">
                <div className="summary-card">Total Applicants: {summary.totalApplicants}</div>
                <div className="summary-card">Approved: {summary.totalApproved}</div>
                <div className="summary-card">Pending: {summary.totalPending}</div>
                <div className="summary-card">Rejected: {summary.totalRejected}</div>
                <div className="summary-card">Total Donations: {summary.totalDonations}</div>
                <div className="summary-card">Total Donors: {summary.totalDonors}</div>
            </div>

            <div className="filters">
                <label>Date Range: </label>
                <input type="date" />
                <input type="date" />
            </div>

            <div className="tables-section">
                <div className="table-container">
                    <h3>Applications</h3>
                    <RecordTable data={applications} columns={applicationColumns} headers={applicationHeaders}/>
                </div>
                <div className="table-container">
                    <h3>Donations</h3>
                    <RecordTable data={donations} columns={donationColumns} headers={donationHeaders}/>
                </div>
            </div>
        </div>
    );
}

export default OwnerPage;
