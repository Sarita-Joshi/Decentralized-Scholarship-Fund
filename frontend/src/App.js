import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { contractABI, contractAddress } from "./contractABI";

function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [applications, setApplications] = useState([]);
    const [donationAmount, setDonationAmount] = useState("");
    const [totalDonations, setTotalDonations] = useState(0);
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
    
                const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(tempProvider);
                const signer = tempProvider.getSigner();
                const tempContract = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(tempContract);
    
                // Fetch total donations as a property (not a function call)
                const total = await tempContract.getTotalDonations();
                setTotalDonations(ethers.utils.formatEther(total));
    
                const donationsList = await tempContract.getDonations();
                setDonations(donationsList);
            } else {
                alert("Please install MetaMask.");
            }
        };
        init();
    }, []);
    

    // Fetch applications (mocked here, but would be fetched from MongoDB in a real app)
    const fetchApplications = async () => {
        // Add code to fetch applications from MongoDB here
        // Assuming MongoDB has a `status` field, mock data here for demonstration
        const mockApplications = [
            { id: 1, applicant: "0x123...", requestedAmount: "0.5", status: "Approved" },
            { id: 2, applicant: "0x456...", requestedAmount: "0.2", status: "Pending" }
        ];
        setApplications(mockApplications);
    };

    // Disburse funds to an approved applicant
    const disburseFunds = async (id) => {
        try {
            const tx = await contract.disburseFunds(id);
            await tx.wait();
            alert(`Funds disbursed to applicant with ID: ${id}`);
        } catch (error) {
            console.error("Disbursement failed:", error);
            alert("Failed to disburse funds. Please check the console for details.");
        }
    };

    // Make a donation
    const makeDonation = async () => {
        try {
            const tx = await contract.donate({
                value: ethers.utils.parseEther(donationAmount)
            });
            await tx.wait();
            alert("Thank you for your donation!");

            // Refresh total donations and donations list
            const total = await contract.getTotalDonations(); // Call the getter function
            setTotalDonations(ethers.utils.formatEther(total.toString()));

            const donationsList = await contract.getDonations();
            setDonations(donationsList);
        } catch (error) {
            console.error("Donation failed:", error);
            alert("Failed to process donation. Please check console for details.");
        }
    };


    return (
        <div>
            <h2>Scholarship Fund DApp</h2>
            <p>Connected account: {account}</p>

            <div>
                <h3>Make a Donation</h3>
                <input
                    type="text"
                    placeholder="Donation Amount (ETH)"
                    onChange={(e) => setDonationAmount(e.target.value)}
                />
                <button onClick={makeDonation}>Donate</button>
                <p>Total Donations: {totalDonations} ETH</p>
            </div>

            <div>
                <h3>Applications</h3>
                <button onClick={fetchApplications}>Fetch Applications</button>
                <ul>
                    {applications.map((application) => (
                        <li key={application.id}>
                            Applicant: {application.applicant}, Amount: {application.requestedAmount} ETH, Status: {application.status}
                            {application.status === "Approved" && (
                                <button onClick={() => disburseFunds(application.id)}>Disburse Funds</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Donation History</h3>
                <ul>
                    {donations.map((donation, index) => (
                        <li key={index}>
                            Donor: {donation.donor} - Amount: {ethers.utils.formatEther(donation.amount)} ETH
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
