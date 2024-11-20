import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your actual API base URL

//////////////////////
// Application Functions
//////////////////////

// Create a new application
export const createApplication = async (applicationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/applications`, applicationData);
        return response.data.mongoDbHash; // Assuming the response contains a MongoDB hash
    } catch (error) {
        console.error("Error creating application:", error.response?.data || error.message);
        throw error;
    }
};

// Get an application by ID (by applicant address or unique MongoDB hash)
export const getApplicationByAddress = async (address) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications/${address}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) return null; // Handle 404 errors gracefully
        console.error("Error fetching application:", error.response?.data || error.message);
        throw error;
    }
};

// Get all applications
export const getAllApplications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications`);
        return response.data;
    } catch (error) {
        console.error("Error fetching applications:", error.response?.data || error.message);
        throw error;
    }
};

// Update application status by ID
export const updateAppStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error.response?.data || error.message);
        throw error;
    }
};

// Update application with applicant ID
export const updateAppId = async (id, applicantId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, { applicantId });
        return response.data;
    } catch (error) {
        console.error("Error updating applicant ID:", error.response?.data || error.message);
        throw error;
    }
};

// Update application with applicant ID
export const updateFundId = async (id, fundAddress) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, { fundAddress });
        return response.data;
    } catch (error) {
        console.error("Error updating applicant ID:", error.response?.data || error.message);
        throw error;
    }
};

// Get all approved applications
export const getApprovedApplications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications/approved`);
        return response.data;
    } catch (error) {
        console.error("Error fetching approved applications:", error.response?.data || error.message);
        throw error;
    }
};

// Fetch applications for a specific fund
export const getApplicationsByFund = async (fundId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications/fund/${fundId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching applications by fund:", error.response?.data || error.message);
        throw error;
    }
};

//////////////////////
// Fund Functions
//////////////////////

// Create a new fund
export const createFundInDB = async (fundData) => {
    try {
        console.log(fundData);
        const response = await axios.post(`${API_BASE_URL}/funds`, fundData);
        console.log(['dfdfaddf', response.data]);
        return response.data.mongoDbHash;
    } catch (error) {
        console.error("Error creating fund:", error.response?.data || error.message);
        throw error;
    }
};

// Get fund details by ID
export const getFundDetails = async (fundId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/funds/${fundId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching fund details:", error.response?.data || error.message);
        throw error;
    }
};

// Get all funds
export const getAllFunds = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/funds`);
        return response.data;
    } catch (error) {
        console.error("Error fetching funds:", error.response?.data || error.message);
        throw error;
    }
};

//////////////////////
// Donation Functions
//////////////////////

// Create a new donation
export const createDonation = async (donationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/donations`, donationData);
        return response.data;
    } catch (error) {
        console.error("Error creating donation:", error.response?.data || error.message);
        throw error;
    }
};

// Get total donations amount
export const getTotalDonationsMongo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/donations/total`);
        return response.data.total;
    } catch (error) {
        console.error("Error fetching total donations:", error.response?.data || error.message);
        throw error;
    }
};

// Get all donations
export const getAllDonations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/donations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching donations:", error.response?.data || error.message);
        throw error;
    }
};

// Get donations for a specific fund
export const getDonationsByFund = async (fundId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/donations/fund/${fundId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching donations by fund:", error.response?.data || error.message);
        throw error;
    }
};
