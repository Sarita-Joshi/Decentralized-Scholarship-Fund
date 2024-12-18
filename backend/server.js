require("dotenv").config();
const moment = require("moment");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Define Application Schema
const applicationSchema = new mongoose.Schema(
  {
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
    approvers: [{ type: String }], // Array of reviewer IDs who approved
    rejectors: [{ type: String }], // Array of reviewer IDs who rejected
    requiredApprovals: {type: Number, default: 1},
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

// Define Fund Schema
const fundSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Fund = mongoose.model("Fund", fundSchema);

// Define Donation Schema
const donationSchema = new mongoose.Schema(
  {
    donorAddress: String,
    amount: Number,
    fundId: { type: String, required: true }, // Link to Fund
    fundOwner: { type: String },
    fundName: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

async function deleteIncompleteApplications() {
  try {
    const result = await Application.deleteMany({ applicantId: "default" });
    console.log("Deleted many");
    console.log(result);
    return `${result.deletedCount} incomplete applications deleted successfully.`;
  } catch (error) {
    throw new Error(`Error deleting incomplete applications: ${error.message}`);
  }
}

//////////////////////
// Fund Routes
//////////////////////

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
      subtitle: fund.fundDescription || "No description provided",
      totalFunds: fund.initialBalance || 0,
      totalApplicants: fundApplications.length,
      fundsNeeded: fundsNeeded,
      fundOwner: fund.fundOwner,
      minApprovals: fund.minimumApprovals,
      autoDisburseFunds: fund.autoDisburseFunds
    };
  });
  return transformedFunds;
}

// Create a new fund
app.post("/funds", async (req, res) => {
  try {
    const fund = new Fund(req.body);
    const first_donation = new Donation({
      donorAddress: fund.fundOwner,
      amount: fund.initialBalance,
      fundId: fund.fundId,
      fundOwner: fund.fundOwner,
      fundName: fund.fundName
    });
    await fund.save();
    await first_donation.save();

    funds = await formatFunds([fund]);
    res.status(201).json(funds[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all funds
app.get("/funds", async (req, res) => {
  try {
    let funds = await Fund.find();
    if (req.query.format === "true") {
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
    if (req.query.format === "true") {
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
    let fund = await Fund.find({ fundOwner: req.params.account });
    if (!fund) {
      return res.status(404).json({ error: "Fund not found" });
    }
    if (req.query.format === "true") {
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
    const fund = await Fund.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
    const application = await Application.findOne({
      applicantAddress: req.params.id,
    });
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
  const { id } = req.params;
  const { status, reviewerId } = req.body;
  const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (status === "Approved") {
      if (!reviewerId) {
        return res.status(404).json({ error: "Reviewer not found" });
      }
      if (!application.approvers.includes(reviewerId)) {
        application.approvers.push(reviewerId);
        application.requiredApprovals--;

        if (application.requiredApprovals===0) {
          application.status = status;
        }
      }
    } else if (status === "Rejected") {
      if (!reviewerId) {
        return res.status(404).json({ error: "Reviewer not found" });
      }
      if (!application.rejectors.includes(reviewerId)) {
        application.rejectors.push(reviewerId);
      }
    } else {
        application.status = status; // Funded
    }
    const updatedApplication = await application.save();
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update application status" });
  }
});

// Update application status by ID
app.put("/applications/:id/update", async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update application status" });
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
      { $group: { _id: null, total: { $sum: "$amount" } } },
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
      Id: item._id.toString(),
      "Donor Address": item.donorAddress,
      Amount: item.amount,
      Date: moment(item.timestamp).format("YYYY-MM-DD HH:mm:ss"),
    }));
    res.json(donations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/metrics", async (req, res) => {
    try {
        const { fundOwner, donorAddress } = req.query;

        // Fetch all funds and applications
        const allFunds = await Fund.find();
        const allApplications = await Application.find();
        const allDonations = await Donation.find();

        let metrics = {
            totalApplications: 0,
            approvedApplications: 0,
            pendingApplications: 0,
            fundedApplications: 0,
            rejectedApplications: 0,
            totalApplicationAmount: 0,
            activeFunds: 0,
            totalDonations: 0,
            donorDonations: 0, // For specific donor
            donationCount: 0, // Number of donations by donor
        };

        // Filter funds by fund owner if provided
        const funds = fundOwner
            ? allFunds.filter(fund => fund.fundOwner === fundOwner)
            : allFunds;

        // Calculate total applications for the filtered funds
        const applications = funds.length > 0
            ? allApplications.filter(app => funds.some(fund => fund.fundId === app.fundId))
            : allApplications;

        metrics.totalApplications = applications.length;
        metrics.approvedApplications = applications.filter(app => app.status === "Approved").length;
        metrics.pendingApplications = applications.filter(app => app.status === "Pending").length;
        metrics.fundedApplications = applications.filter(app => app.status === "Funded").length;
        metrics.rejectedApplications = applications.filter(app => app.status === "Rejected").length;
        metrics.totalApplicationAmount = applications.reduce((sum, app) => sum + app.requestedAmount, 0);

        // Count active funds
        metrics.activeFunds = funds.filter(fund => fund.status === "Active").length;

        // Calculate total donations across all funds
        metrics.totalDonations = allDonations.reduce((sum, donation) => sum + donation.amount, 0);

        // Calculate donations by donor if provided
        if (donorAddress) {
            const donorDonations = allDonations.filter(donation => donation.donorAddress === donorAddress);
            metrics.donorDonations = donorDonations.reduce((sum, donation) => sum + donation.amount, 0);
            metrics.donationCount = donorDonations.length;
        }

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//////////////////////
// Start Server
//////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
