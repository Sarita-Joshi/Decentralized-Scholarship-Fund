import React, { useState } from 'react';
import './ApplicantTable.css';
import { FaSort, FaFilter } from 'react-icons/fa'; // Import icons
import ProfileModal from '../../components/ProfileModal/ProfileModal'; // Import the modal component

const ApplicantTable = ({ data, actions, filters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null); // State for the modal
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Number of rows per page


    // Format the date to a human-readable format
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Apply search, filter, and sorting
    const filteredApplicants = data
        .filter((applicant) =>
            applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((applicant) => (filterStatus ? applicant.status === filterStatus : true))
        .sort((a, b) => {
            if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
            if (sortBy === 'status') return a.status.localeCompare(b.status);
            if (sortBy === 'date') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });
        
    const totalPages = Math.ceil(filteredApplicants.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    

    return (
        <div className="applicant-table-container">
            {/* Controls (Search, Sort, Filter) */}
            <div className="controls">
                {filters?.showSearch && (
                    <input
                        type="text"
                        placeholder="Search for applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}
                {filters?.showSort && (
                    <div className="dropdown-with-icon">
                        <FaSort className="icon" />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="">Sort By</option>
                            <option value="name">Name</option>
                            <option value="status">Status</option>
                            <option value="date">Date</option>
                        </select>
                    </div>
                )}
                {filters?.showFilter && (
                    <div className="dropdown-with-icon">
                        <FaFilter className="icon" />
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">Filter by Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Table */}
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
                    {paginatedApplicants.map((applicant) => (
                        <tr key={applicant._id} >
                            <td onClick={() => setSelectedProfile(applicant)}>{applicant.fullName}</td>
                            <td onClick={() => setSelectedProfile(applicant)}>{applicant.email}</td>
                            <td>
                                <span className={`status-tag ${applicant.status.toLowerCase()}`}>
                                    {applicant.status}
                                </span>
                            </td>
                            <td>{formatDate(applicant.createdAt)}</td>
                            <td>
                            {applicant.status === "Pending" && (
                                    <>
                                        <button
                                            className="approve-btn"
                                            onClick={() => actions.approve(applicant)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={() => actions.reject(applicant)}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                
                <button
                    className="pagination-btn"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    &#60; {/* Left Arrow */}
                </button>
                <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    &#62; {/* Right Arrow */}
                </button>
            </div>

            {/* Profile Modal */}
            <ProfileModal
                profile={selectedProfile}
                onClose={() => setSelectedProfile(null)}
            />
        </div>
    );
};

export default ApplicantTable;
