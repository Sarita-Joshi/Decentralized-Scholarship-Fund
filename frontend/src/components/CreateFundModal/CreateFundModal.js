import React, { useState } from "react";
import Select from "react-select";
import { FaUser, FaSchool, FaMoneyBill, FaInfoCircle } from "react-icons/fa";
import "./CreateFundModal.css";

import illustration1 from "../../assets/application/appl_start.gif";
import illustration2 from "../../assets/application/appl_brain.gif";
import illustration3 from "../../assets/application/appl_bank.gif";

const CreateFundModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fundName: "Fund ABC",
    fundDescription: "ABC...XYZ",
    eligibilityGender: "",
    eligibilityEducation: "",
    eligibilityLocation: "",
    minimumContribution: 0,
    initialBalance: 20,
    fundStartDate: "",
    fundEndDate: "",
    reviewers: [],
    minimumApprovals: 0,
    autoDisburseFunds: false,
    fundCategory: "education",
  });

  const illustrations = [
    illustration1,
    illustration2,
    illustration3,
    illustration1,
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const educationOptions = [
    { value: "highschool", label: "High School" },
    { value: "bachelor", label: "Bachelor’s Degree" },
    { value: "master", label: "Master’s Degree" },
    { value: "phd", label: "PhD" },
  ];

  const locationOptions = [
    { value: "us", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "india", label: "India" },
    { value: "uk", label: "United Kingdom" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (field, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption,
    }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = () => {
    console.log(['fundModal', formData]);
    onSubmit(formData);
    onClose();
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h4>Fund Details</h4>
            <label>
              Fund Name
              <input
                type="text"
                name="fundName"
                value={formData.fundName}
                onChange={handleChange}
              />
            </label>
            <label>
              Fund Description
              <textarea
                name="fundDescription"
                value={formData.fundDescription}
                onChange={handleChange}
              />
            </label>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <h4>Eligibility Criteria</h4>

            <label>
              Gender
              <Select
                options={genderOptions}
                classNamePrefix="react-select"
                placeholder="Select Gender"
                value={formData.gender}
                onChange={(selectedOption) =>
                  handleSelectChange("gender", selectedOption)
                }
              />
            </label>
            <label>
              Education Level
              <Select
                options={educationOptions}
                classNamePrefix="react-select"
                placeholder="Select Education Level"
                value={formData.education}
                onChange={(selectedOption) =>
                  handleSelectChange("education", selectedOption)
                }
              />
            </label>
            <label>
              Location
              <Select
                options={locationOptions}
                classNamePrefix="react-select"
                placeholder="Select Location"
                value={formData.location}
                onChange={(selectedOption) =>
                  handleSelectChange("location", selectedOption)
                }
              />
            </label>
          </div>
        );
      case 3:
        return (
          <div className="form-section">
            <h4>Fund Requirements</h4>
            <div className="inline-fields">
              <label>
                Initial Balance (ETH)
                <input
                  type="number"
                  name="initialBalance"
                  value={formData.initialBalance}
                  onChange={handleChange}
                />
              </label>
              <label>
                Minimum Contribution (ETH)
                <input
                  type="number"
                  name="minimumContribution"
                  value={formData.minimumContribution}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="inline-fields">
              <label>
                Fund Start Date
                <input
                  type="date"
                  name="fundStartDate"
                  value={formData.fundStartDate}
                  onChange={handleChange}
                />
              </label>
              <label>
                Fund End Date
                <input
                  type="date"
                  name="fundEndDate"
                  value={formData.fundEndDate}
                  onChange={handleChange}
                />
              </label>
            </div>
            <label>
              Minimum Approvals Required
              <input
                type="number"
                name="minimumApprovals"
                value={formData.minimumApprovals}
                onChange={handleChange}
              />
            </label>
          </div>
        );
      case 4:
        return (
          <div className="form-section">
            <h4>Review and Final Details</h4>
            <label>
              Reviewers (Optional, comma-separated)
              <input
                type="text"
                name="reviewers"
                value={formData.reviewers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reviewers: e.target.value.split(","),
                  })
                }
              />
            </label>
            <label>
              Fund Category
              <input
                type="text"
                name="fundCategory"
                value={formData.fundCategory}
                onChange={handleChange}
              />
            </label>
            <label className="label">
              Automatic Disburse Funds
              <div className="switch">
                <input
                  type="checkbox"
                  name="autoDisburseFunds"
                  checked={formData.autoDisburseFunds || false}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      autoDisburseFunds: e.target.checked,
                    }))
                  }
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="content-wrapper">
        <div className="illustration-container">
          <img
            src={illustrations[currentStep - 1]}
            alt="Illustration"
            className="illustration"
          />
          <h3>Create a new Fund</h3>
          <p>Help the youth pursue their dreams.</p>
        </div>
        <div className="form-container">
          <div className="step-indicator">
            <span className={currentStep === 1 ? "active" : ""}>1</span>
            <span className={currentStep === 2 ? "active" : ""}>2</span>
            <span className={currentStep === 3 ? "active" : ""}>3</span>
            <span className={currentStep === 4 ? "active" : ""}>4</span>
          </div>

          <div className="step-indicator">
            <FaUser
              className={currentStep === 1 ? "section-icon" : "section-icon-na"}
            />
            <FaSchool
              className={currentStep === 2 ? "section-icon" : "section-icon-na"}
            />
            <FaMoneyBill
              className={currentStep === 3 ? "section-icon" : "section-icon-na"}
            />
            <FaInfoCircle
              className={currentStep === 4 ? "section-icon" : "section-icon-na"}
            />
          </div>

          {renderFormContent()}

          <div className="button-group">
            <button onClick={onClose}>Cancel</button>
            {currentStep > 1 && <button onClick={handlePrev}>Prev</button>}
            {currentStep < 4 && <button onClick={handleNext}>Next</button>}
            {currentStep === 4 && (
              <button onClick={handleSubmit}>Submit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default CreateFundModal;
