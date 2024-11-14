import React, { useState, useEffect } from 'react';
import RecordTable from '../components/RecordTable';
import './ReviewerPage.css';
import { approveApplication } from "../contractUtils";
import { updateAppStatus, getAllApplications } from '../dbUtils';

function ReviewerPage() {
    // Dummy data for applications
    const [applications, setApplications] = useState([
        { id: 1, applicant: '0x1234...5678', amount: '0.5 ETH', status: 'Pending' },
        { id: 2, applicant: '0x2345...6789', amount: '1.2 ETH', status: 'Approved' },
        { id: 3, applicant: '0x3456...7890', amount: '0.8 ETH', status: 'Rejected' },
        { id: 4, applicant: '0x4567...8901', amount: '2.0 ETH', status: 'Pending' },
    ]);

    // Fetch applications on load
    useEffect(() => {
        const loadApplications = async () => {
            const appData = await getAllApplications();
            //TODO filter and kee ponly pending applications
            setApplications(appData);
        };
        loadApplications();
    }, []);

    const [filter, setFilter] = useState('All');

    // Columns for RecordTable
    const columns = ['id', 'applicant', 'amount', 'status'];

    // Actions for RecordTable
    const actions = [
        {
            label: 'Approve',
            onClick: (row) => {
                alert(`Approving application ID: ${row.id}`);
                // Here you would implement the logic to approve this application
                updateApplicationStatus(row.id, 'Approved');
            },
        },
        {
            label: 'Reject',
            onClick: (row) => {
                alert(`Rejecting application ID: ${row.id}`);
                // Here you would implement the logic to reject this application
                updateApplicationStatus(row.id, 'Rejected');
            },
        },
    ];

    // Update application status in the dummy data
    const updateApplicationStatus = async (id, newStatus) => {
        const result = await approveApplication(id, newStatus);
        alert(result.message);

        if (result.success) {
            updateAppStatus(id, newStatus);
            setApplications((prevApps) =>
                prevApps.map((app) =>
                    app.id === id ? { ...app, status: newStatus } : app
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
                <RecordTable data={filteredApplications} columns={columns} actions={actions} />
            </div>
        </div>
    );
}

export default ReviewerPage;
