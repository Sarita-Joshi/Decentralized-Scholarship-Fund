import React, { useState } from 'react';
import './ApplicantTable.css'; // Add styling for the table and dropdowns

const ApplicantTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    
    const applicants = [
        { id: 1, name: 'John Doe', status: 'Approved', date: '2024-11-15', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', status: 'Pending', date: '2024-11-10', email: 'jane@example.com' },
        { id: 3, name: 'Alice Johnson', status: 'Rejected', date: '2024-11-05', email: 'alice@example.com' },
    ];

    // Search Filter
    const filteredApplicants = applicants
        .filter((applicant) =>
            applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((applicant) => (filterStatus ? applicant.status === filterStatus : true));

    // Sort Functionality
    const sortedApplicants = [...filteredApplicants].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
        return 0;
    });

    return (
        <div className="record-table">
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search for applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                    <option value="date">Date</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Filter by Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedApplicants.map((applicant) => (
                        <tr key={applicant.id}>
                            <td>{applicant.name}</td>
                            <td>{applicant.email}</td>
                            <td>
                                <span className={`status-tag ${applicant.status.toLowerCase()}`}>
                                    {applicant.status}
                                </span>
                            </td>
                            <td>{applicant.date}</td>
                            <td>
                                <button className="action-btn">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicantTable;
