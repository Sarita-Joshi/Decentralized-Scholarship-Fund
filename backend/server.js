require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS package
const app = express();

// Enable CORS for all routes
app.use(cors()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Define Application Schema with detailed fields
const applicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    institution: { type: String, required: true },
    program: { type: String, required: true },
    year: { type: String, required: true },
    gpa: { type: String, required: true },
    requestedAmount: { type: Number, required: true },
    reason: { type: String, required: true },
    personalStatement: { type: String, required: true },
    applicantAddress: String,
    status: { type: String, default: "Pending" },
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

// Define Donation Schema
const donationSchema = new mongoose.Schema({
    donorAddress: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);

//////////////////////
// Application Routes
//////////////////////

// Create a new application and return mongoDbHash (MongoDB _id)
app.post("/applications", async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        
        // Send mongoDbHash (MongoDB _id) to the frontend
        res.status(201).json({ mongoDbHash: application._id, application });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get an application by ID
app.get("/applications/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update application status by ID
app.put("/applications/:id/status", async (req, res) => {
    const { status } = req.body;
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all approved applications
app.get("/approved-applications", async (req, res) => {
    try {
        const approvedApplications = await Application.find({ status: "Approved" });
        res.json(approvedApplications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all approved applications
app.get("/all-applications", async (req, res) => {
    try {
        const approvedApplications = await Application.find();
        res.json(approvedApplications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//////////////////////
// Donation Routes
//////////////////////

// Create a new donation
app.post("/donations", async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();
        res.status(201).json(donation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get total donations
app.get("/donations/total", async (req, res) => {
    try {
        const totalDonations = await Donation.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const total = totalDonations[0]?.total || 0;
        res.json({ total });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all donations
app.get("/donations", async (req, res) => {
    try {
        const donations = await Donation.find();
        res.json(donations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//////////////////////
// Start Server
//////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
