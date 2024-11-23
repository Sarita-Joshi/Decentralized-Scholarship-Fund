import React, { useState, useEffect } from "react";
import FundCard from "../components/FundCard/FundCard";
import ApplicationFormModal from "../components/ApplicationFormModal"; // Import the form modal
import StatusModal from "../components/StatusModal"; 
import { getUserAccount } from '../contractUtils';
import { getApplicationByAddress } from '../dbUtils';
import "./ApplicantPage.css";

const ApplicantPage = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  // Function to handle opening the modal
  const openStatusModal = (status) => {
      setApplicationStatus("Approved"); // Set the application status
      setIsStatusModalOpen(true);        // Show the modal
  };

  // Function to handle closing the modal
  const closeStatusModal = () => {
    setIsStatusModalOpen(false);       // Hide the modal
  };

  useEffect(() => {
    // Load funds and user account data
    const loadData = async () => {
      // Fetch user account
      const userAccount = await getUserAccount();
      setAccount(userAccount);

      // Fetch user's application status
      const application = await getApplicationByAddress(userAccount);
      setApplicationStatus(application?.status || null);

      // Load funds data
      setFunds([
        {
          id: 1,
          banner: null,
          title: "Education Fund",
          subtitle: "Support students in need of financial aid.",
          totalFunds: 10,
          totalApplicants: 50,
          fundsNeeded: 20,
        },
        {
          id: 2,
          banner: null,
          title: "Health Fund",
          subtitle: "Help communities with better healthcare facilities.",
          totalFunds: 5,
          totalApplicants: 30,
          fundsNeeded: 15,
        },
        {
          id: 3,
          banner: null,
          title: "Animal Welfare Fund",
          subtitle: "Protect and care for animals in need.",
          totalFunds: 2,
          totalApplicants: 10,
          fundsNeeded: 10,
        },
      ]);
    };

    loadData();
  }, []);

  const openApplicationModal = (fund) => {
    setSelectedFund(fund);
    setIsModalOpen(true);
  };

  const closeApplicationModal = () => {
    setSelectedFund(null);
    setIsModalOpen(false);
  };

  const handleCheckStatus = () => {
    // Navigate to application status (or show modal)
    openStatusModal();
  };

  return (
    <div className="browse-funds-page">
      {/* Top Ribbon */}
      <div className="top-ribbon">
        <div className="profile-section">
          <img
            src="https://via.placeholder.com/100" // Replace with actual profile image
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-details">
            <h3>John Doe</h3>
            <p>Email: john.doe@example.com</p>
            <p>Address: <strong>{account}</strong></p>
          </div>
        </div>
        <button className="status-button" onClick={handleCheckStatus}>
          Check Application Status
        </button>
      </div>

      {/* Browse Funds Section */}
      <div className="donation-cards">
                <h2 className='top-funds-heading'>Top Funds to Donate</h2>
                <div className="cards-container">
                    {funds.map((fund) => (
                        <FundCard
                            key={fund.id}
                            banner={fund.banner}
                            title={fund.title}
                            subtitle={fund.subtitle}
                            totalFunds={fund.totalFunds}
                            totalApplicants={fund.totalApplicants}
                            fundsNeeded={fund.fundsNeeded}
                            buttonLabel="Apply Now"
                            onDonate={() => {openApplicationModal(fund)}}
                        />
                    ))}
                </div>
            </div>

      {/* Application Form Modal */}
      {isModalOpen && (
        <ApplicationFormModal
          fund={selectedFund}
          onClose={closeApplicationModal}
        />
      )}

      {isStatusModalOpen && (
                <StatusModal status={applicationStatus} onClose={closeStatusModal} />
            )}
    </div>
  );
};

export default ApplicantPage;
