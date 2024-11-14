import React, { useState, useEffect } from 'react';
import StatusModal from '../components/StatusModal';
import { submitApplication } from '../contractUtils';
import {createApplication} from '../dbUtils';
import './ApplicantPage.css';

function ApplicantPage() {
    const [showModal, setShowModal] = useState(true); // Controls the modal visibility
    const [hasActiveApplication, setHasActiveApplication] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);

    const [formData, setFormData] = useState({
        fullName: 'John Doe',
        email: 'JD@csuf.edu',
        phoneNumber: '9999999999',
        institution: 'CSUF',
        program: 'MS CS',
        year: 'First',
        gpa: '3.5',
        requestedAmount: '0.5',
        reason: 'I need money',
        personalStatement: 'I am Good',
    });

    const [errors, setErrors] = useState({});
    const [section, setSection] = useState(1); // Controls the current section of the form

    // Simulated database check for active application status
    useEffect(() => {
        const activeApplication = false; // Change this to simulate an active application
        const status = "Pending"; // Example status

        setHasActiveApplication(activeApplication);
        setApplicationStatus(status);
    }, []);

    // Handle Check Status option
    const handleCheckStatus = () => {
        setShowModal(false);
        setShowApplicationForm(false); // Show status view if there's an active application
    };

    // Handle New Application option
    const handleNewApplication = () => {
        setShowModal(false);
        setShowApplicationForm(true); // Show form if there's no active application
    };

    // Handle input change for the form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Validate and Save each section
    const handleSave = (currentSection) => {
        const newErrors = validateSection(currentSection);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setSection(currentSection + 1); // Proceed to the next section if valid
        }
    };

    // Clear data for the specified section
    const handleClear = (currentSection) => {
        const sectionData = {
            1: { fullName: '', email: '', phoneNumber: '' },
            2: { institution: '', program: '', year: '', gpa: '' },
            3: { requestedAmount: '', reason: '' },
            4: { personalStatement: '' },
        };
        setFormData((prevData) => ({ ...prevData, ...sectionData[currentSection] }));
        setErrors({});
    };

    // Final submission of the application
    const handleSubmit = async () => {
        if (section === 4 && Object.keys(errors).length === 0) {
            console.log("Application Submitted:", formData);
            const mongoDBHash = createApplication(formData);
            const result = await submitApplication(
                mongoDBHash,
                formData.requestedAmount
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
                setSection(1);
                setShowApplicationForm(false); // Close the form
                setShowModal(true); // Show the modal again
            } else {
                alert(result.message);
            }
            
        } else {
            alert("Please complete all sections before submitting.");
        }
    };

    // Validate fields for each section
    const validateSection = (sectionNumber) => {
        return {};
        // const errors = {};
        
        // if (sectionNumber === 1) {
        //     if (!formData.fullName) errors.fullName = "Full Name is required";
        //     if (!formData.email) errors.email = "Email is required";
        //     if (!formData.phoneNumber) errors.phoneNumber = "Phone Number is required";
        // } else if (sectionNumber === 2) {
        //     if (!formData.institution) errors.institution = "Institution is required";
        //     if (!formData.program) errors.program = "Program of Study is required";
        // } else if (sectionNumber === 3) {
        //     if (!formData.requestedAmount) errors.requestedAmount = "Requested Amount is required";
        //     if (!formData.reason) errors.reason = "Reason for Funding is required";
        // }
        // return errors;
    };

    // Render application status
    const renderApplicationStatus = () => (
        <div className="application-status">
            <h3>Your Application Status</h3>
            <p>Status: {applicationStatus}</p>
        </div>
    );

    // Render expandable application form
    const renderApplicationForm = () => (
        <div className="application-form">
            <h3>New Scholarship Application</h3>
            
            {section >= 1 && (
                <div className={`form-section ${section === 1 ? 'expanded' : 'collapsed'}`}>
                    <h4>Personal Details</h4>
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                    {errors.fullName && <span className="error">{errors.fullName}</span>}
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                    {errors.email && <span className="error">{errors.email}</span>}
                    <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                    {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                    <button onClick={() => handleSave(1)}>Save</button>
                    <button onClick={() => handleClear(1)}>Clear</button>
                </div>
            )}

            {section >= 2 && (
                <div className={`form-section ${section === 2 ? 'expanded' : 'collapsed'}`}>
                    <h4>Education Details</h4>
                    <input type="text" name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} />
                    {errors.institution && <span className="error">{errors.institution}</span>}
                    <input type="text" name="program" placeholder="Program of Study" value={formData.program} onChange={handleChange} />
                    {errors.program && <span className="error">{errors.program}</span>}
                    <input type="text" name="year" placeholder="Year of Study" value={formData.year} onChange={handleChange} />
                    <input type="text" name="gpa" placeholder="GPA" value={formData.gpa} onChange={handleChange} />
                    <button onClick={() => handleSave(2)}>Save</button>
                    <button onClick={() => handleClear(2)}>Clear</button>
                </div>
            )}

            {section >= 3 && (
                <div className={`form-section ${section === 3 ? 'expanded' : 'collapsed'}`}>
                    <h4>Financial Details</h4>
                    <input type="text" name="requestedAmount" placeholder="Requested Amount (ETH)" value={formData.requestedAmount} onChange={handleChange} />
                    {errors.requestedAmount && <span className="error">{errors.requestedAmount}</span>}
                    <textarea name="reason" placeholder="Reason for Funding" value={formData.reason} onChange={handleChange}></textarea>
                    {errors.reason && <span className="error">{errors.reason}</span>}
                    <button onClick={() => handleSave(3)}>Save</button>
                    <button onClick={() => handleClear(3)}>Clear</button>
                </div>
            )}

            {section >= 4 && (
                <div className={`form-section ${section === 4 ? 'expanded' : 'collapsed'}`}>
                    <h4>Supporting Information</h4>
                    <textarea name="personalStatement" placeholder="Personal Statement" value={formData.personalStatement} onChange={handleChange}></textarea>
                    <button onClick={handleSubmit}>Submit Application</button>
                    <button onClick={() => handleClear(4)}>Clear</button>
                </div>
            )}
        </div>
    );

    return (
        <div>
            {showModal && (
                <StatusModal
                    onClose={() => setShowModal(false)}
                    onCheckStatus={handleCheckStatus}
                    onNewApplication={handleNewApplication}
                />
            )}
            {!showModal && (showApplicationForm ? renderApplicationForm() : renderApplicationStatus())}
        </div>
    );
}

export default ApplicantPage;
