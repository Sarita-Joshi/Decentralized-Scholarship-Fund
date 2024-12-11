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
  let message = null;
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    
    if (accounts.length > 0) {
      message = `Already connected: ${accounts}`;
      account = accounts[0];
      return (account, message);
    } else {
      const newAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected:", newAccounts);
      account = newAccounts[0];
      return (account, message);
    }
  } catch (error) {
    if (error.code === -32002) {
      message = "MetaMask request is already in progress. Please complete the request.";
    } else {
      message =  `MetaMask connection failed: ${error.message}`;
    }
    return (null, message);
  }
};

export const getUserAccount = async () => {
  if (!account) {
    await connectWallet();
  }
  return account;
};

// Check if the connected account is the contract owner
export const checkIfOwner = async (account_) => {
  try {
    const contract = await getContractInstance();
    const ownerAddress = await contract.getOwner();
    console.log(ownerAddress);
    console.log(["ggggg",ownerAddress, account_])
    return account_.toLowerCase() === ownerAddress.toLowerCase();
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
      autoDisburseFunds = false,
    } = fundData;

    const contract = await getContractInstance();
    const fundAmount = ethers.utils.parseEther(initialBalance.toString());
    console.log(
      fundName,
      autoDisburseFunds,
      minimumApprovals,
      reviewers,
      initialBalance,
      fundAmount
    );
    const tx = await contract.createFund(
      fundName,
      minimumApprovals,
      reviewers,
      autoDisburseFunds,
      {
        value: fundAmount,
      }
    );
    const receipt = await tx.wait();
    const fundId = receipt.events[0].args[0];
    return { success: true, message: "Fund created!", id: fundId.toString() };
  } catch (error) {
    console.error("Fund creation failed:", error);
    return { success: false, message: "Failed to create fund.", id: null };
  }
};

// Approve or reject an application
export const approveApplication = async (applicationId, approve) => {
  try {
    const contract = await getContractInstance();

    const signer = await contract.signer.getAddress();
    if (!signer) {
      throw new Error("No wallet connected. Please connect MetaMask.");
    }

    // Call the reviewApplication function
    const tx = await contract.reviewApplication(applicationId, approve);
    const receipt = await tx.wait();
    console.log("Transaction:", receipt);

    // Fetch updated application details
    const updatedApp = await contract.getApplication(applicationId);
    const fund_ = await contract.getFund(updatedApp.fundId);
    const autoDisbursed = updatedApp.status === "Funded";

    console.log(updatedApp);
    console.log(fund_);

    const status = updatedApp.status;
    return {
      success: true,
      message: `Application ${status}.`,
      status,
      autoDisbursed,
    };
  } catch (error) {
    console.error("Application update failed:", error);
    error = error.data.message;
    alert(error);
    if (error.includes("Application does not exist")) {
      return { success: false, message: "The application does not exist." };
    } else if (error.includes("not authorized to review this application")) {
      return { success: false, message: "You are not authorized to review this application." };
      
    } else if (error.includes("Already reviewed this application")) {
      return { success: false, message: "You have already reviewed this application." };
    } else {
      return { success: false, message: "Failed to update application." };
    }
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
    console.log(error.message);
    if (error.data.message.includes("not authorized")) {
      alert("Permission Denied: Incorrect wallet address");
    }
    console.error("Disbursement failed:", error);
    return { success: false, message: "Failed to disburse funds." };
  }
};
