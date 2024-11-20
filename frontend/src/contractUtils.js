import { ethers } from "ethers";
import { ScholarshipFundABI, ScholarshipFundAddress } from "./contractABI";

// Define your contract address and ABI
const CONTRACT_ADDRESS = ScholarshipFundAddress;
const CONTRACT_ABI = ScholarshipFundABI;

// Singleton contract instance
let contract = null;
let provider = null;
let signer = null;
let account = null;

// Function to initialize the provider, signer, and contract if not already done
const getContractInstance = async () => {
  if (contract) return contract;

  if (!window.ethereum) {
    alert("Please install MetaMask to use this application.");
    return null;
  }

  // Connect to MetaMask
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  return contract;
};

//////////////////////
// Contract Functions
//////////////////////

// Connect to MetaMask and set the current account
export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask.");
    return null;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  account = accounts[0];
  return accounts[0];
};

export const getUserAccount = async () => {
  if (!account) {
    await connectWallet();
  }
  return account;
};

// Check if the connected account is the contract owner
export const checkIfOwner = async () => {
  try {
    const contract = await getContractInstance();
    const ownerAddress = await contract.getOwner();
    return account.toLowerCase() === ownerAddress.toLowerCase();
  } catch (error) {
    console.error("Error checking ownership:", error);
    return false;
  }
};

///////////////////////////
// New Scholarship Features
///////////////////////////

// Create a new fund
export const createFundOnChain = async (formData) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.createFund(
      formData.name,
      formData.minAmount, // Convert to smallest units
      formData.maxAmount,
      formData.criteriaHash.toString(),
      formData.criteria.minApprovals
    );
    const receipt = await tx.wait();
    // Extract the application ID from the event
    const fundId = receipt.events[0].args[0];
    return { success: true, message: "Fund created successfully!", id: fundId.toString() };
  } catch (error) {
    console.error("Failed to create fund:", error);
    return { success: false, message: "Failed to create fund." };
  }
};

// Donate to a specific fund
export const donateToFund = async (fundId, amount) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.donate(fundId, ethers.utils.parseEther(amount));
    await tx.wait();
    return { success: true, message: "Donation successful!" };
  } catch (error) {
    console.error("Donation failed:", error);
    return { success: false, message: "Donation failed." };
  }
};

// Submit a new application to the contract
export const submitApplication = async (applicationAmount, fundID, metadataHash) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.submitApplication(
      fundID,
      ethers.utils.parseEther(applicationAmount),
      metadataHash // This could be a hash from MongoDB or IPFS
    );
    // await tx.wait();
    const receipt = await tx.wait();
    // Extract the application ID from the event
    const applicationId = receipt.events[0].args[0];
    console.log("Application ID:", applicationId.toString());
    
    return { success: true, message: "Application submitted!", id: applicationId.toString() };
  } catch (error) {
    console.error("Application submission failed:", error);
    return { success: false, message: "Failed to submit application.", id:null };
  }
};
// Approve an application
export const approveApplication = async (fundId, applicationIndex) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.approveApplication(fundId, applicationIndex);
    await tx.wait();
    return { success: true, message: "Application approved successfully!" };
  } catch (error) {
    console.error("Failed to approve application:", error);
    return { success: false, message: "Failed to approve application." };
  }
};

// Disburse funds to an applicant
export const disburseFunds = async (fundId, applicationIndex) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.disburseFunds(fundId, applicationIndex);
    await tx.wait();
    return {
      success: true,
      message: "Funds disbursed successfully!",
    };
  } catch (error) {
    console.error("Failed to disburse funds:", error);
    return { success: false, message: "Failed to disburse funds." };
  }
};

// Fetch fund details
export const getFundDetails = async (fundId) => {
  try {
    const contract = await getContractInstance();
    const fund = await contract.funds(fundId);
    return {
      name: fund.name,
      owner: fund.owner,
      minAmount: ethers.utils.formatEther(fund.minAmount),
      maxAmount: ethers.utils.formatEther(fund.maxAmount),
      criteria: fund.criteria,
      approvalsNeeded: fund.approvalsNeeded.toString(),
      balance: ethers.utils.formatEther(fund.balance),
    };
  } catch (error) {
    console.error("Failed to fetch fund details:", error);
    return null;
  }
};

// Fetch all applications for a specific fund
export const fetchApplicationsForFund = async (fundId) => {
  try {
    const contract = await getContractInstance();
    const applications = await contract.getApplications(fundId);
    return applications.map((app) => ({
      applicant: app.applicant,
      amountRequested: ethers.utils.formatEther(app.amountRequested),
      reason: app.reason,
      approvals: app.approvals.toString(),
      approved: app.approved,
      disbursed: app.disbursed,
    }));
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return [];
  }
};
