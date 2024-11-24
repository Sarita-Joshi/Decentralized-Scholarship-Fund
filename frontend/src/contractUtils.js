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
export const checkIfOwner = async (account) => {
  try {
    const contract = await getContractInstance();
    const ownerAddress = await contract.owner();
    return account.toLowerCase() === ownerAddress.toLowerCase();
  } catch (error) {
    console.error("Error checking ownership:", error);
    return false;
  }
};

// Fetch total donations for a specific fund
export const getTotalDonations = async (fundId = 1) => {
  try {
    const contract = await getContractInstance();
    const fund = await contract.getFund(fundId);
    return ethers.utils.formatEther(fund.balance.toString());
  } catch (error) {
    console.error("Error fetching total donations:", error);
    return null;
  }
};

// Fetch applications for a specific fund
export const fetchApplications = async (fundId = 1) => {
  try {
    const contract = await getContractInstance();
    const applications = [];
    for (let i = 1; i <= fundId; i++) {
      const app = await contract.getApplication(i);
      applications.push(app);
    }
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

// Make a donation to a specific fund
export const makeDonation = async (amount, fundId = 1) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.donateToFund(fundId, {
      value: ethers.utils.parseEther(amount),
    });
    await tx.wait();
    return { success: true, message: "Donation successful!" };
  } catch (error) {
    console.error("Donation failed:", error);
    return { success: false, message: "Donation failed." };
  }
};

// Submit a new application to the contract
export const submitApplication = async (
  applicationAmount,
  metadataHash,
  fundId = 1
) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.submitApplication(
      ethers.utils.parseEther(applicationAmount),
      metadataHash,
      fundId
    );
    const receipt = await tx.wait();
    const applicationId = receipt.events[0].args[0];
    return {
      success: true,
      message: "Application submitted!",
      id: applicationId.toString(),
    };
  } catch (error) {
    console.error("Application submission failed:", error);
    return {
      success: false,
      message: "Failed to submit application.",
      id: null,
    };
  }
};

// Create a new fund
export const CreateFundOnChain = async (fundData = {}) => {
  try {
    const {
      fundName = "Default Fund",
      minimumApprovals = 1,
      reviewers = [],
      initialBalance = "0.01",
    } = fundData;

    const contract = await getContractInstance();
    const fundAmount = ethers.utils.parseEther(initialBalance);
    console.log(fundName, minimumApprovals, reviewers, initialBalance, fundAmount);
    const tx = await contract.createFund(fundName, minimumApprovals, reviewers, {
      value: fundAmount,
    });
    const receipt = await tx.wait();
    const fundId = receipt.events[0].args[0];
    return { success: true, message: "Fund created!", id: fundId.toString() };
  } catch (error) {
    console.error("Fund creation failed:", error);
    return { success: false, message: "Failed to create fund.", id: null };
  }
};

// Approve or reject an application
export const approveApplication = async (applicationId = 1, approve = true) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.updateApplicationStatus(applicationId, approve);
    await tx.wait();
    const status = approve ? "Approved" : "Rejected";
    return { success: true, message: `Application ${status}.` };
  } catch (error) {
    console.error("Application update failed:", error);
    return { success: false, message: "Failed to update application." };
  }
};

// Disburse funds to an approved applicant
export const disburseFunds = async (applicationId = 1) => {
  try {
    const contract = await getContractInstance();
    const tx = await contract.disburseFunds(applicationId);
    await tx.wait();
    return {
      success: true,
      message: `Funds disbursed to applicant ${applicationId}!`,
    };
  } catch (error) {
    console.error("Disbursement failed:", error);
    return { success: false, message: "Failed to disburse funds." };
  }
};
