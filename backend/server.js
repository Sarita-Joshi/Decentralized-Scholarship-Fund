require('dotenv').config();
const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

//////////////////////
// Schemas and Models
//////////////////////

// Application Schema
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
    applicantId: { type: String, required: true },
    status: { type: String, default: "Pending" },
    fundId: { type: mongoose.Schema.Types.ObjectId, ref: "Fund", required: true }
}, { timestamps: true });
const Application = mongoose.model("Application", applicationSchema);

// Fund Schema
const fundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    criteria: {
        minAmount: Number,
        maxAmount: Number,
        education: String,
        residency: String,
        demographic: String,
        minApprovals: Number
    },
    totalDonations: { type: Number, default: 0 },
    ownerAddress: { type: String, required: true },
    fundAddress: { type: String, default: 'default' }
}, { timestamps: true });
const Fund = mongoose.model("Fund", fundSchema);

// Donation Schema
const donationSchema = new mongoose.Schema({
    donorAddress: String,
    fundId: { type: mongoose.Schema.Types.ObjectId, ref: "Fund", required: true },
    amount: Number,
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
const Donation = mongoose.model("Donation", donationSchema);

//////////////////////
// Fund Routes
//////////////////////

// Create a new fund
app.post("/funds", async (req, res) => {
    try {
        const fund = new Fund(req.body);
        await fund.save();
        res.status(201).json({ mongoDbHash: fund._id, fund });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get fund details by ID
app.get("/funds/:id", async (req, res) => {
    try {
        const fund = await Fund.findById(req.params.id);
        if (!fund) return res.status(404).json({ error: "Fund not found" });
        res.json(fund);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all funds
app.get("/funds", async (req, res) => {
    try {
        const funds = await Fund.find();
        res.json(funds);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//////////////////////
// Application Routes
//////////////////////

// Create a new application
app.post("/applications", async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json({ mongoDbHash: application._id, application });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get applications for a specific fund
app.get("/applications/fund/:fundId", async (req, res) => {
    try {
        const applications = await Application.find({ fundId: req.params.fundId });
        res.json(applications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Other application routes remain unchanged
app.get("/applications/:id", async (req, res) => {
    try {
        const application = await Application.findOne({ applicantAddress: req.params.id });
        if (!application) return res.status(404).json({ error: "Application not found" });
        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put("/applications/:id/status", async (req, res) => {
    try {
        const application = await Application.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!application) return res.status(404).json({ error: "Application not found" });
        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/approved-applications", async (req, res) => {
    try {
        const approvedApplications = await Application.find({ status: "Approved" });
        res.json(approvedApplications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/all-applications", async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
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
        await Fund.findByIdAndUpdate(
            req.body.fundId,
            { $inc: { totalDonations: req.body.amount } },
            { new: true }
        );
        res.status(201).json(donation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get donations for a specific fund
app.get("/donations/fund/:fundId", async (req, res) => {
    try {
        const donations = await Donation.find({ fundId: req.params.fundId });
        res.json(donations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Other donation routes remain unchanged
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

app.get("/donations", async (req, res) => {
    try {
        const donations = await Donation.find();
        res.json(
            donations.map((item) => ({
                Id: item._id.toString(),
                "Donor Address": item.donorAddress,
                Amount: item.amount,
                Date: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            }))
        );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//////////////////////
// Start Server
//////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
