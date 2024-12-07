import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your API URL if different


// Create a new application
export const createFundMongo = async (fundData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/funds`, fundData);
        return response.data;
    } catch (error) {
        console.error("Error creating application:", error);
        throw error;
    }
};

// Get an application by ID
export const getFundByAddress = async (id, format='true') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/funds/${id}?format=${format}`);
        return response.data;
    } catch (error) {
        if (error.status === 404) return null;
        console.error("Error fetching application:", error);
        throw error;
    }
};

// Get all applications
export const getFundsByOwner = async (account, format='true') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/funds/account/${account}?format=${format}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching applications:", error);
        throw error;
    }
};

// Get all applications
export const getAllFunds = async (format='true') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/funds?format=${format}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching applications:", error);
        throw error;
    }
};

// Update fund status by ID
export const updateFundStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/fund/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
    }
};

// Update fund id by ID
export const updateFundId = async (id, fundId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/fund/${id}/status`, { fundId });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
    }
};


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
export const getApplicationByAddress = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/applications/${id}`);
        return response.data;
    } catch (error) {
        if (error.status === 404) return null;
        console.error("Error fetching application:", error);
        throw error;
    }
};

// Get all applications
export const getAllApplications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all-applications`);
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

// Update application status by ID
export const updateAppId = async (id, applicantId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, { applicantId });
        return response.data;
    } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
    }
};

// Get all approved applications
export const getApprovedApplications = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/approved-applications`);
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

// Get metrics
export const getMetricsMongo = async (data={}) => {

    let { fundOwner, donorAddress } = data;
    try {
        const response = await axios.get(`${API_BASE_URL}/metrics?fundOwner=${fundOwner}&donorAddress${donorAddress}`);
        return response.data;
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
