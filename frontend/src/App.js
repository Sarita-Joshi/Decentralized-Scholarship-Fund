import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ScholarshipFundABI, ScholarshipFundAddress } from "./contractABI";

function App() {
    const [account, setAccount] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [donationAmount, setDonationAmount] = useState("");
    const [applicationAmount, setApplicationAmount] = useState("");
    const [applications, setApplications] = useState([]);
    const [totalDonations, setTotalDonations] = useState(0);
    const [scholarshipFund, setScholarshipFund] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const scholarshipFundInstance = new ethers.Contract(ScholarshipFundAddress, ScholarshipFundABI, signer);
                setScholarshipFund(scholarshipFundInstance);

                // Verify if the connected account is the contract owner
                const ownerAddress = await scholarshipFundInstance.getOwner();
                setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());
                console.log("owner: ${ownerAddress}");
                // Fetch total donations from the ScholarshipFund (controller) contract
                const totalDonations = await scholarshipFundInstance.getTotalDonations();
                setTotalDonations(ethers.utils.formatEther(totalDonations.toString()));

                fetchApplications();
            } else {
                alert("Please install MetaMask.");
            }
        };
        init();
    }, []);

    // Fetch applications from the ScholarshipFund (mocked data here, but in reality, you'd retrieve real data)
    const fetchApplications = async () => {
        if (!scholarshipFund) return;

        const mockApplications = [
            { id: 1, applicant: "0x123...", amount: "0.5", status: "Pending" },
            { id: 2, applicant: "0x456...", amount: "0.2", status: "Approved" }
        ];
        setApplications(mockApplications);
    };

    // Make a donation through the ScholarshipFund contract
    const makeDonation = async () => {
        if (!scholarshipFund || donationAmount <= 0) return;
        try {
            const tx = await scholarshipFund.donate({
                value: ethers.utils.parseEther(donationAmount)
            });
            await tx.wait();
            alert("Donation successful!");

            const total = await scholarshipFund.getTotalDonations();
            setTotalDonations(ethers.utils.formatEther(total.toString()));
        } catch (error) {
            console.error("Donation failed:", error);
            alert("Donation failed.");
        }
    };

    // Submit an application through the ScholarshipFund contract
    const submitApplication = async () => {
        if (!scholarshipFund || applicationAmount <= 0) return;
        try {
            const tx = await scholarshipFund.submitApplication(
                ethers.utils.parseEther(applicationAmount),
                "MongoDB_Hash_Example"
            );
            await tx.wait();
            alert("Application submitted!");

            fetchApplications();
        } catch (error) {
            console.error("Application submission failed:", error);
            alert("Failed to submit application.");
        }
    };

    // Approve an application (Owner only) through the ScholarshipFund contract
    const approveApplication = async (applicationId) => {
        if (!scholarshipFund || !isOwner) return;
        try {
            const tx = await scholarshipFund.updateApplicationStatus(applicationId, "Approved");
            await tx.wait();
            alert(`Application ${applicationId} approved!`);

            fetchApplications();
        } catch (error) {
            console.error("Application approval failed:", error);
            alert("Failed to approve application.");
        }
    };

    // Disburse funds to an approved applicant (Owner only) through the ScholarshipFund contract
    const disburseFunds = async (applicationId, recipient, amount) => {
        if (!scholarshipFund || !isOwner) return;
        try {
            const tx = await scholarshipFund.disburseFunds(applicationId);
            await tx.wait();
            alert(`Funds disbursed to applicant ${applicationId}!`);

            fetchApplications();
        } catch (error) {
            console.error("Disbursement failed:", error);
            alert("Failed to disburse funds.");
        }
    };

    return (
        <div>
            <h2>Scholarship Fund DApp</h2>
            <p>Connected account: {account}</p>
            <p>Total Donations: {totalDonations} ETH</p>
            <p>Is Owner: {isOwner ? "Yes" : "No"}</p>

            <div>
                <h3>Make a Donation</h3>
                <input
                    type="text"
                    placeholder="Donation Amount (ETH)"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                />
                <button onClick={makeDonation}>Donate</button>
            </div>

            <div>
                <h3>Submit Application</h3>
                <input
                    type="text"
                    placeholder="Application Amount (ETH)"
                    value={applicationAmount}
                    onChange={(e) => setApplicationAmount(e.target.value)}
                />
                <button onClick={submitApplication}>Submit Application</button>
            </div>

            <div>
                <h3>Applications</h3>
                <ul>
                    {applications.map((application) => (
                        <li key={application.id}>
                            Applicant: {application.applicant} | Amount: {application.amount} ETH | Status: {application.status}
                            {isOwner && application.status === "Pending" && (
                                <button onClick={() => approveApplication(application.id)}>Approve</button>
                            )}
                            {isOwner && application.status === "Approved" && (
                                <button onClick={() => disburseFunds(application.id, application.applicant, application.amount)}>Disburse Funds</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
