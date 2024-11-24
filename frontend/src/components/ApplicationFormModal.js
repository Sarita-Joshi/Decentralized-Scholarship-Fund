import React, { useState } from "react";
import { FaUser, FaSchool, FaMoneyBill, FaInfoCircle } from "react-icons/fa";
import "./ApplicationFormModal.css";

import illustration1 from '../assets/appl_start.gif';
import illustration2 from '../assets/appl_brain.gif';
import illustration3 from '../assets/appl_bank.gif';


const ApplicationFormModal = ({ fund, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: 'Jon Doe',
    email: 'jod@gmail.com',
    phoneNumber: '9999999999',
    institution: 'CSUF',
    program: 'MS CS',
    year: 'Senior',
    gpa: '3.5',
    requestedAmount: '0.5',
    reason: 'I need Money',
    personalStatement: 'I am good student',
    applicantAddress: '',
    applicantId: 'default',
});

  const illustrations = [
    illustration1,
    illustration2,
    illustration3,
    illustration1
];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);
  
  const handleSubmit = () => {
    console.log("Application Submitted:", formData);
    onSubmit(formData);
    alert("Application Submitted Successfully!");
    onClose();
  };

  const renderFormContent = () => {
    switch (currentStep) {
        case 1:
            return (
                <div className="form-section">
                    <h4>Personal Details</h4>
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
            );
        case 2:
            return (
                <div className="form-section">
                    <h4>Education Details</h4>
                    <label>Institution
                        <input type="text" name="institution" value={formData.institution} onChange={handleChange} />
                    </label>
                    <label>Program of Study
                        <input type="text" name="program" value={formData.program} onChange={handleChange} />
                    </label>
                    <div className="inline-fields">
                    <label>Year of Study
                        <input type="text" name="year" value={formData.year} onChange={handleChange} />
                    </label>
                    <label>GPA
                        <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} />
                    </label>
                    </div>
                </div>
            );
        case 3:
            return (
                <div className="form-section">
                    <h4>Financial Details</h4>
                    <label>Requested Amount (ETH)
                        <input type="number" name="requestedAmount" value={formData.requestedAmount} onChange={handleChange} />
                    </label>
                    <label>Reason for Funding
                        <textarea className="money-textarea" name="reason" value={formData.reason} onChange={handleChange}></textarea>
                    </label>
                </div>
            );
        case 4:
            return (
                <div className="form-section">
                    <h4>Supporting Information</h4>
                    <label>Personal Statement
                        <textarea className="statement-textarea" name="personalStatement" value={formData.personalStatement} onChange={handleChange}></textarea>
                    </label>
                    
                </div>
            );
        default:
            return null;
    }
};

  


  return (
    <div className="modal-overlay">
     <div className="content-wrapper">
                <div className="illustration-container">
                    <img src={illustrations[currentStep-1]} alt="Illustration" className="illustration" />
                    <h3>Apply for {fund.title}</h3>
                    <p>Follow the steps to complete your application for financial aid.</p>
                </div>
                <div className="form-container">
                    <div className="step-indicator">
                        <span className={currentStep === 1 ? "active" : ""}>1</span>
                        <span className={currentStep === 2 ? "active" : ""}>2</span>
                        <span className={currentStep === 3 ? "active" : ""}>3</span>
                        <span className={currentStep === 4 ? "active" : ""}>4</span>
                    </div>

                    <div className="step-indicator">
                        <FaUser className={currentStep === 1 ? "section-icon" : "section-icon-na"}/>
                        <FaSchool className={currentStep === 2 ? "section-icon" : "section-icon-na"}  />
                        <FaMoneyBill className={currentStep === 3 ? "section-icon" : "section-icon-na"}  />
                        <FaInfoCircle className={currentStep === 4 ? "section-icon" : "section-icon-na"}  />
                     </div>

                    {renderFormContent()}

                    <div className="button-group">
                        <button onClick={onClose}>Cancel</button>
                        {currentStep > 1 && <button onClick={handlePrev}>Prev</button>}
                        {currentStep < 4 && <button onClick={handleNext}>Next</button>}
                        {currentStep === 4 && <button onClick={handleSubmit}>Submit</button>}
                    </div>
                </div>
            </div>
    </div>
  );
};

export default ApplicationFormModal;
