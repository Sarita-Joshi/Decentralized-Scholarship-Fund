
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

// Seed function to add dummy data
async function seedData() {
    try {
        // Clear existing data
        await Application.deleteMany({});
        await Donation.deleteMany({});
        console.log("Cleared old data");

        // Dummy applications
        const applications = [
            {
                fullName: "Alice Johnson",
                email: "alice@example.com",
                phoneNumber: "123-456-7890",
                institution: "Tech University",
                program: "Computer Science",
                year: "Sophomore",
                gpa: "3.7",
                requestedAmount: 1500,
                reason: "To support internship expenses",
                personalStatement: "I am passionate about software engineering...",
                applicantAddress: "0xAbc123...",
                status: "Pending"
            },
            {
                fullName: "Bob Smith",
                email: "bob@example.com",
                phoneNumber: "098-765-4321",
                institution: "Science College",
                program: "Biology",
                year: "Junior",
                gpa: "3.9",
                requestedAmount: 2000,
                reason: "To cover lab equipment costs",
                personalStatement: "I am focused on biomedical research...",
                applicantAddress: "0xDef456...",
                status: "Approved"
            },
            {
                fullName: "Carol Adams",
                email: "carol@example.com",
                phoneNumber: "555-123-4567",
                institution: "Engineering Institute",
                program: "Mechanical Engineering",
                year: "Senior",
                gpa: "3.5",
                requestedAmount: 2500,
                reason: "To support final project expenses",
                personalStatement: "My goal is to innovate in sustainable design...",
                applicantAddress: "0xGhi789...",
                status: "Pending"
            }
        ];

        // Dummy donations
        const donations = [
            { donorAddress: "0x123Abc...", amount: 500 },
            { donorAddress: "0x456Def...", amount: 750 },
            { donorAddress: "0x789Ghi...", amount: 1000 },
        ];

        // Insert dummy applications
        await Application.insertMany(applications);
        console.log("Inserted applications");

        // Insert dummy donations
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
