import { ethers } from 'ethers';
import { ScholarshipFundABI, ScholarshipFundAddress } from "./contractABI";

// Define your contract address and ABI
const CONTRACT_ADDRESS = ScholarshipFundAddress;
const CONTRACT_ABI = ScholarshipFundABI;


// Singleton contract instance
let contract = null;
let provider = null;
let signer = null;
let account = null

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

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
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
        const ownerAddress = await contract.getOwner();
        return account.toLowerCase() === ownerAddress.toLowerCase();
    } catch (error) {
        console.error("Error checking ownership:", error);
        return false;
    }
};

// Fetch total donations from the contract
export const getTotalDonations = async () => {
    try {
        const contract = await getContractInstance();
        const totalDonations = await contract.getTotalDonations();
        return ethers.utils.formatEther(totalDonations.toString());
    } catch (error) {
        console.error("Error fetching total donations:", error);
        return null;
    }
};

// Fetch applications (replace with actual data fetching logic as needed)
export const fetchApplications = async () => {
    try {
        const contract = await getContractInstance();
        const applications = await contract.getApplications(); // Adjust based on your contract
        return applications;
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
};

// Make a donation through the contract
export const makeDonation = async (amount) => {
    try {
        const contract = await getContractInstance();
        const tx = await contract.donate({
            value: ethers.utils.parseEther(amount)
        });
        await tx.wait();
        return { success: true, message: "Donation successful!" };
    } catch (error) {
        console.error("Donation failed:", error);
        return { success: false, message: "Donation failed." };
    }
};

// Submit a new application to the contract
export const submitApplication = async (applicationAmount, metadataHash) => {
    try {
        const contract = await getContractInstance();
        const tx = await contract.submitApplication(
            ethers.utils.parseEther(applicationAmount),
            metadataHash // This could be a hash from MongoDB or IPFS
        );
        await tx.wait();
        return { success: true, message: "Application submitted!" };
    } catch (error) {
        console.error("Application submission failed:", error);
        return { success: false, message: "Failed to submit application." };
    }
};

// Approve an application (only for contract owner)
export const approveApplication = async (applicationId, newStatus) => {
    try {
        const contract = await getContractInstance();
        const applicationAddress = ethers.utils.getAddress(applicationId);
        const tx = await contract.updateApplicationStatus(applicationAddress, newStatus);
        await tx.wait();
        return { success: true, message: `Application ${applicationId} ${newStatus}.` };
    } catch (error) {
        console.error("Application update failed:", error);
        return { success: false, message: "Failed to update application." };
    }
};

// Disburse funds to an approved applicant (only for contract owner)
export const disburseFunds = async (applicationId) => {
    try {
        const contract = await getContractInstance();
        const tx = await contract.disburseFunds(applicationId);
        await tx.wait();
        return { success: true, message: `Funds disbursed to applicant ${applicationId}!` };
    } catch (error) {
        console.error("Disbursement failed:", error);
        return { success: false, message: "Failed to disburse funds." };
    }
};
