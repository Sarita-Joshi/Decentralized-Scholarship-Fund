import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { FaUser, FaSchool, FaMoneyBill, FaInfoCircle } from 'react-icons/fa';
import { getUserAccount, submitApplication } from '../contractUtils'; // Adjust import based on your utils structure
import {createApplication, getApplicationByAddress} from '../dbUtils';
import './ApplicantPage.css';

function ApplicantPage() {
    const [hasActiveApplication, setHasActiveApplication] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [account, setAccount] = useState(null);
    const [formData, setFormData] = useState({
        fullName: 'John Doe',
        email: 'JD@csuf.edu',
        phoneNumber: '9999999999',
        applicantAddress: '0xAbc123...',
        institution: 'CSUF',
        program: 'MS CS',
        year: 'First',
        gpa: '3.5',
        requestedAmount: '0.5',
        reason: 'I need money',
        personalStatement: 'I am Good',
        status: 'Pending'
    });

    const [errors, setErrors] = useState({});


    useEffect(() => {
        // Simulate fetching application status from database or contract
        const fetchApplicationStatus = async () => {
            const userAccount = '0xABC123...' //await getUserAccount();
            setAccount(userAccount);
            let application =  await getApplicationByAddress(userAccount);
            
            const status = application?.status;
            // const status = null; // Example: "Approved", "Rejected", "Pending", or null if no application
            if (status) {
                setApplicationStatus(status);
                setHasActiveApplication(true);
            }

            console.log({status, hasActiveApplication});
        };

        fetchApplicationStatus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Final submission of the application
    const handleSubmit = async () => {
        let errors = validateSection();
        
        if (Object.keys(errors).length === 0) {
            console.log("Application Submitted:", formData);
            const mongoDBHash = await createApplication(formData);
            formData.applicantAddress = account;
            const result = await submitApplication(
                formData.requestedAmount.toString(),
                mongoDBHash.toString(),
            );

            if (result.success) {
                alert(result.message);

                setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    institution: '',
                    program: '',
                    year: '',
                    gpa: '',
                    requestedAmount: '',
                    reason: '',
                    personalStatement: '',
                });
                setApplicationStatus("Pending");
                setHasActiveApplication(true);
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

    const handleClear = () => {
        setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            institution: '',
            program: '',
            year: '',
            gpa: '',
            requestedAmount: '',
            reason: '',
            personalStatement: '',
        });
        setErrors({});
    };

    const getContent = () => {
        switch (applicationStatus) {
            case 'Approved':
                return {
                    message: "Congratulations! Your application is approved!",
                    image: 'approved_image_url', // Replace with celebratory image URL
                    quote: '',
                    showConfetti: true
                };
            case 'Rejected':
                return {
                    message: "Unfortunately, your application was not approved.",
                    image: 'rejected_image_url', // Replace with sad image URL
                    quote: "Don't lose faith! Try harder next time. All the best!",
                    showConfetti: false
                };
            case 'Pending':
                return {
                    message: "Your application is complete. Check back with us later.",
                    image: 'pending_image_url', // Replace with waiting/pending image URL
                    quote: "Don't lose faith! We’ll get back to you soon.",
                    showConfetti: false
                };
            default:
                return null;
        }
    };

    const renderApplicationStatus = () => {
        const content = getContent();

        return (
            <div className="status-card">
                {content.showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                <h2>{content.message}</h2>
                <img src={content.image} alt={`${applicationStatus} illustration`} className="status-image" />
                {content.quote && <p className="quote">{content.quote}</p>}
            </div>
        );
    };

    // Replace the renderApplicationForm function with this code
const renderApplicationForm = () => (
    <div className="application-form">
        <h3>New Scholarship Application</h3>

        {/* Personal Details Section */}
        <div className="form-section">
            <div className="section-title">
                <FaUser className="section-icon" />
                <h4>Personal Details</h4>
            </div>
            <div className="section-content">
                <label>Full Name
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                </label>
                <label>Email
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </label>
                <label>Phone Number
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </label>
            </div>
        </div>

        {/* Education Details Section */}
        <div className="form-section">
            <div className="section-title">
                <FaSchool className="section-icon" />
                <h4>Education Details</h4>
            </div>
            <div className="section-content">
                <label>Institution
                    <input type="text" name="institution" value={formData.institution} onChange={handleChange} />
                </label>
                <label>Program of Study
                    <input type="text" name="program" value={formData.program} onChange={handleChange} />
                </label>
                <label>Year of Study
                    <input type="text" name="year" value={formData.year} onChange={handleChange} />
                </label>
                <label>GPA
                    <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} />
                </label>
            </div>
        </div>

        {/* Financial Details Section */}
        <div className="form-section">
            <div className="section-title">
                <FaMoneyBill className="section-icon" />
                <h4>Financial Details</h4>
            </div>
            <div className="section-content">
                <label>Requested Amount (ETH)
                    <input type="number" name="requestedAmount" value={formData.requestedAmount} onChange={handleChange} />
                </label>
                <label>Reason for Funding
                    <textarea name="reason" value={formData.reason} onChange={handleChange}></textarea>
                </label>
            </div>
        </div>

        {/* Supporting Information Section */}
        <div className="form-section">
            <div className="section-title">
                <FaInfoCircle className="section-icon" />
                <h4>Supporting Information</h4>
            </div>
            <div className="section-content">
                <label>Personal Statement
                    <textarea name="personalStatement" value={formData.personalStatement} onChange={handleChange}></textarea>
                </label>
            </div>
        </div>

        {/* Save and Clear Buttons */}
        <div className="button-group">
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleClear}>Clear</button>
        </div>
    </div>
);


    return (
        <div className="applicant-page">
            {hasActiveApplication ? renderApplicationStatus() : renderApplicationForm()}
        </div>
    );
}

export default ApplicantPage;
