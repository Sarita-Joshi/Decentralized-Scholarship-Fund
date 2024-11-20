import React, { useState } from "react";
import { createFundOnChain } from "../../contractUtils"; // Function to interact with the blockchain
import { createFundInDB, updateFundId } from "../../dbUtils"; // Function to save in MongoDB
import "./CreateFund.css";

const CreateFund = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minAmount: 0,
    maxAmount: 1,
    education: "",
    residency: "",
    demographic: "",
    minApprovals: 1,
    ownerAddress: "",
    fundAddress: "default",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null; // Don't render if the modal is not open

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save fund details in MongoDB
      let fundData = {
        name: formData.name,
        description: formData.description,
        criteria: {
          minAmount: formData.minAmount,
          maxAmount: formData.maxAmount,
          education: formData.education,
          residency: formData.residency,
          demographic: formData.demographic,
          minApprovals: formData.minApprovals,
        },
        fundAddress: "default",
        ownerAddress: await window.ethereum.selectedAddress, // Address of the donor
      };

      console.log(['before update', fundData]);
      const mongoDBHash = await createFundInDB(fundData);
      fundData.criteriaHash = mongoDBHash.toString();
      console.log(['before chain', fundData]);
      const result = await createFundOnChain(fundData);

      if (result.success) {
        updateFundId(mongoDBHash.toString(), result.id.toString());
        alert("Fund successfully created!");
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating fund:", error);
      alert("Failed to create fund. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create a New Fund</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Fund Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="minAmount">Minimum Amount</label>
            <input
              type="number"
              id="minAmount"
              name="minAmount"
              value={formData.minAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxAmount">Maximum Amount</label>
            <input
              type="number"
              id="maxAmount"
              name="maxAmount"
              value={formData.maxAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="education">Education Criteria</label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="residency">Residency Criteria</label>
            <input
              type="text"
              id="residency"
              name="residency"
              value={formData.residency}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="demographic">Demographic Criteria</label>
            <input
              type="text"
              id="demographic"
              name="demographic"
              value={formData.demographic}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Fund"}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFund;
