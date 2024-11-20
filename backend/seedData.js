require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define Application Schema
const applicationSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    institution: String,
    program: String,
    year: String,
    gpa: String,
    requestedAmount: Number,
    reason: String,
    personalStatement: String,
    applicantAddress: String,
    applicantId: String,
    status: { type: String, default: "Pending" },
    fundId: { type: mongoose.Schema.Types.ObjectId, ref: "Fund", required: true }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

// Define Fund Schema
const fundSchema = new mongoose.Schema({
    name: String,
    description: String,
    criteria: {
        minAmount: Number,
        maxAmount: Number,
        education: String,
        residency: String,
        demographic: String
    },
    totalDonations: { type: Number, default: 0 },
    ownerAddress: String,
    fundAddress: String
}, { timestamps: true });

const Fund = mongoose.model("Fund", fundSchema);

// Define Donation Schema
const donationSchema = new mongoose.Schema({
    donorAddress: String,
    amount: Number,
    fundId: { type: mongoose.Schema.Types.ObjectId, ref: "Fund", required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);

// Seed function to add dummy data
async function seedData() {
    try {
        // Clear existing data
        await Application.deleteMany({});
        await Fund.deleteMany({});
        await Donation.deleteMany({});
        console.log("Cleared old data");

        // Create dummy funds
        const funds = [
            {
                name: "Technology Scholarship Fund",
                description: "Supports students in technology-related fields.",
                criteria: {
                    minAmount: 1000,
                    maxAmount: 5000,
                    education: "Undergraduate",
                    residency: "USA",
                    demographic: "None"
                },
                ownerAddress: "0xOwner123...",
                fundAddress: "0xFundTech..."
            },
            {
                name: "Women in STEM Fund",
                description: "Empowering women in STEM disciplines.",
                criteria: {
                    minAmount: 1500,
                    maxAmount: 3000,
                    education: "Graduate",
                    residency: "USA",
                    demographic: "Women"
                },
                ownerAddress: "0xOwner456...",
                fundAddress: "0xFundWomen..."
            }
        ];

        const insertedFunds = await Fund.insertMany(funds);
        console.log("Inserted funds");

        // Create dummy applications linked to funds
        const applications = [
            {
                fullName: "Alice Johnson",
                email: "alice@example.com",
                phoneNumber: "123-456-7890",
                institution: "Tech University",
                program: "Computer Science",
                year: "Sophomore",
                gpa: "3.7",
                requestedAmount: 2000,
                reason: "To support internship expenses",
                personalStatement: "I am passionate about software engineering...",
                applicantAddress: "0xApplicantAlice...",
                applicantId: "Applicant123",
                status: "Pending",
                fundId: insertedFunds[0]._id
            },
            {
                fullName: "Bob Smith",
                email: "bob@example.com",
                phoneNumber: "098-765-4321",
                institution: "Science College",
                program: "Biology",
                year: "Junior",
                gpa: "3.9",
                requestedAmount: 2500,
                reason: "To cover lab equipment costs",
                personalStatement: "I am focused on biomedical research...",
                applicantAddress: "0xApplicantBob...",
                applicantId: "Applicant456",
                status: "Approved",
                fundId: insertedFunds[1]._id
            }
        ];

        await Application.insertMany(applications);
        console.log("Inserted applications");

        // Create dummy donations linked to funds
        const donations = [
            { donorAddress: "0xDonor123...", amount: 1000, fundId: insertedFunds[0]._id },
            { donorAddress: "0xDonor456...", amount: 1500, fundId: insertedFunds[1]._id },
            { donorAddress: "0xDonor789...", amount: 2000, fundId: insertedFunds[0]._id }
        ];

        await Donation.insertMany(donations);
        console.log("Inserted donations");

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the seed function
seedData();
