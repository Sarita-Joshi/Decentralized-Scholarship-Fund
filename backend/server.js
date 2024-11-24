require('dotenv').config();
const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Define Application Schema
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
  fundId: { type: String, required: true }, // Link to Fund
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

// Define Fund Schema
const fundSchema = new mongoose.Schema({
  fundId: { type: String, required: true },
  fundName: { type: String, required: true },
  fundDescription: { type: String },
  eligibilityGender: { type: String },
  eligibilityEducation: { type: String },
  eligibilityLocation: { type: String },
  minimumContribution: { type: Number, default: 0 },
  initialBalance: { type: Number, required: true },
  fundStartDate: { type: Date },
  fundEndDate: { type: Date },
  reviewers: [{ type: String }], // List of reviewer addresses
  minimumApprovals: { type: Number, required: true },
  autoDisburseFunds: { type: Boolean, default: false },
  fundCategory: { type: String, required: true },
  fundOwner: { type: String, required: true },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

const Fund = mongoose.model("Fund", fundSchema);

// Define Donation Schema
const donationSchema = new mongoose.Schema({
  donorAddress: String,
  amount: Number,
  fundId: { type: String, required: true }, // Link to Fund
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);

async function deleteIncompleteApplications() {
    try {
        const result = await Application.deleteMany({ applicantId: "default" });
        return `${result.deletedCount} incomplete applications deleted successfully.`;
    } catch (error) {
        throw new Error(`Error deleting incomplete applications: ${error.message}`);
    }
}

//////////////////////
// Fund Routes
//////////////////////

// Create a new fund
app.post("/funds", async (req, res) => {
    try {
      const fund = new Fund(req.body);
      await fund.save();
      res.status(201).json(fund);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

async function formatFunds(funds) {
  const applications = await Application.find();
  const transformedFunds = funds.map((fund) => {
      const fundApplications = applications.filter(
          (app) => app.fundId === fund.fundId
      );
      const fundsNeeded = fundApplications.reduce(
          (sum, app) => sum + app.requestedAmount,
          0
      );
      return {
          id: fund.fundId,
          banner: null,
          title: fund.fundName,
          subtitle: fund.fundDescription || 'No description provided',
          totalFunds: fund.initialBalance || 0,
          totalApplicants: fundApplications.length,
          fundsNeeded: fundsNeeded,
      };
  });
  return transformedFunds;
}
  
  // Get all funds
  app.get("/funds", async (req, res) => {
    try {
      let funds = await Fund.find();
      if (req.query.format=== 'true') {
        funds = await formatFunds(funds);
      }

      res.json(funds);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get fund by ID
  app.get("/funds/:id", async (req, res) => {
    try {
      let fund = await Fund.findById(req.params.id);
      if (!fund) {
        return res.status(404).json({ error: "Fund not found" });
      }
      if (req.query.format=== 'true') {
        fund = await formatFunds(fund);
      }
      res.json(fund);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get fund by Owner
  app.get("/funds/account/:account", async (req, res) => {
    try {
      let fund = await Fund.find({"fundOwner":req.params.account});
      if (!fund) {
        return res.status(404).json({ error: "Fund not found" });
      }
      if (req.query.format === 'true') {
        fund = await formatFunds(fund);
      }
      res.json(fund);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Update fund status
  app.put("/funds/:id/status", async (req, res) => {
    try {
      const fund = await Fund.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!fund) {
        return res.status(404).json({ error: "Fund not found" });
      }
      res.json(fund);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Link applications to a fund
  app.get("/funds/:fundId/applications", async (req, res) => {
    try {
      const applications = await Application.find({ fundId: req.params.fundId });
      res.json(applications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  //////////////////////
  // Application Routes
  //////////////////////
  
  // Update application routes to include fundId when creating an application
  app.post("/applications", async (req, res) => {
    try {
      const { fundId, ...applicationData } = req.body;
  
      // Verify that the fund exists
    //   const fund = await Fund.findById(fundId);
    //   if (!fund) {
    //     return res.status(404).json({ error: "Fund not found" });
    //   }
  
      const application = new Application({ ...applicationData, fundId });
      await application.save();
      res.status(201).json({ mongoDbHash: application._id, application });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
// Get an application by ID
app.get("/applications/:id", async (req, res) => {
    try {
        const application = await Application.findOne({applicantAddress: req.params.id});
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
    try {
        const application = await Application.findOneAndUpdate({_id: req.params.id}, req.body, { new: true });
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
        await deleteIncompleteApplications();
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
        let donations = await Donation.find();
        donations = donations.map((item) => ({
            "Id": item._id.toString(),
            "Donor Address": item.donorAddress,
            "Amount": item.amount,
            "Date": moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
        }));
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
