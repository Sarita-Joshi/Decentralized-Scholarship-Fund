import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your API URL if different

//////////////////////
// Application Functions
//////////////////////

// Create a new application
export const createApplication = async (applicationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/applications`, applicationData);
        return response.data.mongoDbHash;
    } catch (error) {
        console.error("Error creating application:", error);
        throw error;
    }
};

// Get an application by ID
export const getApplicationById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching application:", error);
        throw error;
    }
};

// Get all applications
export const getAllApplications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications`);
        return response.data;
    } catch (error) {
        console.error("Error fetching applications:", error);
        throw error;
    }
};

// Update application status by ID
export const updateAppStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
    }
};

// Get all approved applications
export const getApprovedApplications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications/approved`);
        return response.data;
    } catch (error) {
        console.error("Error fetching approved applications:", error);
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
        console.error("Error creating donation:", error);
        throw error;
    }
};

// Get total donations amount
export const getTotalDonationsMongo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/donations/total`);
        print()
        return response.data.total;
    } catch (error) {
        console.error("Error fetching total donations:", error);
        throw error;
    }
};

// Get all donations
export const getAllDonations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/donations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching donations:", error);
        throw error;
    }
};
