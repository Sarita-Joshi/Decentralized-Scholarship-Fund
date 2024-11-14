import React, { useState, useEffect } from 'react';
import RecordTable from '../components/RecordTable';
import './ReviewerPage.css';
import { approveApplication, getUserAccount } from "../contractUtils";
import { updateAppStatus, getAllApplications } from '../dbUtils';

function ReviewerPage() {
    // Dummy data for applications
    const [applications, setApplications] = useState([[
        { id: 1, applicant: '0x1234...5678', amount: '0.5 ETH', status: 'Pending' },
        { id: 2, applicant: '0x2345...6789', amount: '1.2 ETH', status: 'Approved' },
        { id: 3, applicant: '0x3456...7890', amount: '0.8 ETH', status: 'Rejected' },
        { id: 4, applicant: '0x4567...8901', amount: '2.0 ETH', status: 'Pending' },
    ]]);

    const [account, setAccount] = useState(null);

    // Fetch applications on load
    useEffect(() => {
        const loadApplications = async () => {
            const userAccount = await getUserAccount();
            const appData = await getAllApplications();
            //TODO filter and keep only pending applications
            setApplications(appData);
            setAccount(userAccount);
        };
        loadApplications();
    }, []);

    const [filter, setFilter] = useState('All');

    // Columns for RecordTable
    const columns = ['_id', 'fullName', 'requestedAmount', 'status'];
    const displayColumns = ['Id', 'Applicant', 'Amount', 'Status'];


    // Actions for RecordTable
    const actions = [
        {
            label: 'Approve',
            onClick: async (row) => {
                alert(`Approving application ID: ${row._id}`);
                console.log(applications);
                const appplicant = applications.filter(item => item._id === row._id)[0];
                console.log(appplicant);
                // Here you would implement the logic to approve this application
                await updateApplicationStatus(appplicant.applicantId, appplicant._id, 'Approved');
            },
        },
        {
            label: 'Reject',
            onClick: async (row) => {
                alert(`Approving application ID: ${row._id}`);
                const appplicant = applications.filter(item => item._id === row._id);
                // Here you would implement the logic to approve this application
                await updateApplicationStatus(appplicant.applicantId, appplicant._id, 'Approved');
            },
        },
    ];

    // Update application status in the dummy data
    const updateApplicationStatus = async (id, mongoHash, newStatus) => {
        console.log({id, mongoHash, newStatus})
        const result = await approveApplication(id, newStatus);
        alert(result.message);

        if (result.success) {
            updateAppStatus(mongoHash, newStatus);
            setApplications((prevApps) =>
                prevApps.map((app) =>
                    app._id === mongoHash ? { ...app, status: newStatus } : app
                )
            );
        }
    };

    // Filter applications based on selected status
    const filteredApplications = applications.filter((app) =>
        filter === 'All' ? true : app.status === filter
    );

    return (
        <div>
            <h2>Reviewer Dashboard</h2>
            <p>Manage applications by reviewing and updating their statuses.</p>

            <div className="filter-container">
                <label>Filter by Status: </label>
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div>
                <RecordTable data={filteredApplications} columns={columns} actions={actions} headers={displayColumns} />
            </div>
        </div>
    );
}

export default ReviewerPage;
