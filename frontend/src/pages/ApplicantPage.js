import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { FaUser, FaSchool, FaMoneyBill, FaInfoCircle } from 'react-icons/fa';
import { getUserAccount, submitApplication } from '../contractUtils';
import { createApplication, getApplicationByAddress, updateAppId } from '../dbUtils';
import './ApplicantPage.css';
import illustration1 from '../assets/appl_start.gif';
import illustration2 from '../assets/appl_brain.gif';
import illustration3 from '../assets/appl_bank.gif';

function ApplicantPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [hasActiveApplication, setHasActiveApplication] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [account, setAccount] = useState(null);
    const [errors, setErrors] = useState({});
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

    useEffect(() => {
            // Simulate fetching application status from database or contract
            const fetchApplicationStatus = async () => {
                const userAccount = await getUserAccount(); //'0xABC123...'
                console.log({userAccount});
                setAccount(userAccount);
                console.log({userAccount});
                let application =  await getApplicationByAddress(userAccount);
                
    
                const status = application?.status;
                // const status = null; // Example: "Approved", "Rejected", "Pending", or null if no application
                if (status) {
                    setApplicationStatus(status);
                    setHasActiveApplication(true);

                    
                }
                console.log({account});
                console.log({status, hasActiveApplication});
            };
    
            fetchApplicationStatus();
    }, []);

    const handleChange = (e) => {
        console.log({account, change:'fsdfsdf'});
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleNext = () => setCurrentStep(currentStep + 1);
    const handlePrev = () => setCurrentStep(currentStep - 1);

    const handleSubmit = async () => {
        let errors = validateSection();
        
        if (Object.keys(errors).length === 0) {
            console.log("Application Submitted:", formData);
            formData.applicantAddress = account;
            console.log({formData, account});
            const mongoDBHash = await createApplication(formData);
            
            const result = await submitApplication(
                formData.requestedAmount.toString(),
                mongoDBHash.toString(),
            );

            if (result.success) {
                alert(result.message);
                console.log({mongoDBHash, id:result.id, log:'sdsdgdsgsdsg'})
                updateAppId(mongoDBHash.toString(), result.id.toString())

                setFormData({
                    fullName: '',
                    email: '',
                    applicantId: 'default',
                    applicantAddress: '',
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

    const getContent = () => {
        switch (applicationStatus) {
            case 'Approved':
                return {
                    message: "Congratulations! Your application is approved!",
                    image: 'approved_image_url', // Replace with celebratory image URL
                    quote: '',
                    showConfetti: true
                };
            case 'Funded':
                return {
                    message: "Congratulations! Your Scholarhip is on it's way! Please wait for upto 24 hours to receive scholarship funds.",
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
                        <label>Year of Study
                            <input type="text" name="year" value={formData.year} onChange={handleChange} />
                        </label>
                        <label>GPA
                            <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} />
                        </label>
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
                            <textarea name="reason" value={formData.reason} onChange={handleChange}></textarea>
                        </label>
                    </div>
                );
            case 4:
                return (
                    <div className="form-section">
                        <h4>Supporting Information</h4>
                        <label>Personal Statement
                            <textarea name="personalStatement" value={formData.personalStatement} onChange={handleChange}></textarea>
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="applicant-page">
            {hasActiveApplication ? renderApplicationStatus() : (
            
                <div className="content-wrapper">
                <div className="illustration-container">
                    <img src={illustrations[currentStep-1]} alt="Illustration" className="illustration" />
                    <h3>Apply for a Scholarship</h3>
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
                        {currentStep > 1 && <button onClick={handlePrev}>Prev</button>}
                        {currentStep < 4 && <button onClick={handleNext}>Next</button>}
                        {currentStep === 4 && <button onClick={handleSubmit}>Submit</button>}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default ApplicantPage;
