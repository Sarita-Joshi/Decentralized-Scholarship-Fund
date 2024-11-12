require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Define Application Schema
const applicationSchema = new mongoose.Schema({
    applicantAddress: String,
    requestedAmount: Number,
    mongoDbHash: String,
    status: { type: String, default: "Pending" },
    fullData: Object  // Store full application data
});
const Application = mongoose.model("Application", applicationSchema);

// API Endpoints
app.post("/applications", async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/applications/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        res.json(application);
    } catch (error) {
        res.status(404).json({ error: "Application not found" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
