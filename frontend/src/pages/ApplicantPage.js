import React, { useState, useEffect } from "react";
import FundCard from "../components/FundCard/FundCard";
import ApplicationFormModal from "../components/ApplicationFormModal/ApplicationFormModal"; // Import the form modal
import StatusModal from "../components/StatusModal/StatusModal"; 
import { getUserAccount, submitApplication } from '../contractUtils';
import { createApplication, getAllFunds, getApplicationByAddress, updateAppId } from '../dbUtils';
import "./ApplicantPage.css";
import Header from "../components/Header/Header";

const ApplicantPage = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  // Function to handle opening the modal
  const openStatusModal = (status) => {
      setApplicationStatus(status); // Set the application status
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
      console.log({userAccount, 'status': application?.status});
      setApplicationStatus(application?.status || null);

      const topFunds = await getAllFunds('true');
      setFunds(topFunds);
    };

    loadData();
  }, []);

  const openApplicationModal = (fund) => {
    if (applicationStatus==="Funded" || applicationStatus===null) {
      
    }
    setSelectedFund(fund);
    setIsModalOpen(true);
  };

  const closeApplicationModal = () => {
    setSelectedFund(null);
    setIsModalOpen(false);
  };

  const handleCheckStatus = () => {
    openStatusModal(applicationStatus);
  };

  const handleSubmit = async (formData) => {
    let errors = validateSection();
    
    if (Object.keys(errors).length === 0) {

        formData.fundId = selectedFund.id;
        formData.requiredApprovals = selectedFund.minApprovals || 1;
        console.log("Application Submitted:", formData);
        formData.applicantAddress = account;
        console.log({formData, account});
        const mongoDBHash = await createApplication(formData);
        
        const result = await submitApplication(
            formData.requestedAmount.toString(),
            mongoDBHash.toString(),
            selectedFund.id
        );

        if (result.success) {
            alert(result.message);
            console.log({mongoDBHash, id:result.id, log:'sdsdgdsgsdsg'})
            updateAppId(mongoDBHash.toString(), result.id.toString())
            setApplicationStatus("Pending");
        } else {
            alert(result.message);
        }
        
    } else {
        alert("Please complete all sections before submitting.");
    }
};

// Validate fields for each section
const validateSection = () => {
    return {};
    // const errors = {};
    // if (!formData.fullName) errors.fullName = "Full Name is required";
    // if (!formData.email) errors.email = "Email is required";
    // if (!formData.phoneNumber) errors.phoneNumber = "Phone Number is required";

    // if (!formData.institution) errors.institution = "Institution is required";
    // if (!formData.program) errors.program = "Program of Study is required";

    // if (!formData.requestedAmount) errors.requestedAmount = "Requested Amount is required";
    // if (!formData.reason) errors.reason = "Reason for Funding is required";
    
    // return errors;
};

const profile = {
  name: "John Doe",
  email: "john.doe@example.com",
  address: "123 Blockchain Avenue, Ethereum City",
};

const cta = {
  label: "Check Application Status",
  onClick: handleCheckStatus,
};

  return (
    <div className="browse-funds-page">
      {/* Top Ribbon */}
      <Header profile={profile} stats={[]} cta={cta}/>

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
                            minimumApprovals={fund.minApprovals}
                            autoDisburse={fund.autoDisburseFunds}
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
          onSubmit={handleSubmit}
        />
      )}

      {isStatusModalOpen && (
                <StatusModal status={applicationStatus} onClose={closeStatusModal} />
            )}
    </div>
  );
};

export default ApplicantPage;
