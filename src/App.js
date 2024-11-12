import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./contractABI";

function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [students, setStudents] = useState([]);

    // Initialize connection to MetaMask and set up contract instance
    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    // Request MetaMask account access
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                    setAccount(accounts[0]);
                    console.log("Connected account:", accounts[0]);

                    // Set up provider and signer
                    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
                    setProvider(tempProvider);
                    const signer = tempProvider.getSigner();

                    // Instantiate contract
                    const tempContract = new ethers.Contract(contractAddress, contractABI, signer);
                    setContract(tempContract);
                } catch (error) {
                    console.error("Error connecting to MetaMask:", error);
                    alert("Failed to connect to MetaMask. Please check the console for more details.");
                }
            } else {
                alert("Please install MetaMask to use this application.");
            }
        };
        init();
    }, []);

    // Function to handle donations
    const donateFunds = async () => {
        try {
            console.log(amount);
            if (amount && contract) {
                console.log("Attempting to donate:", amount);
                const tx = await contract.donate({
                    value: ethers.utils.parseEther(amount.toString()), // Ensure amount is correctly formatted
                    gasLimit: 300000
                });
                await tx.wait();  // Wait for the transaction to be mined
                alert("Thank you for your donation!");
                console.log("Donation transaction:", tx);
            } else {
                alert("Please enter a valid amount.");
            }
        } catch (error) {
            console.error("Donation failed:", error);
            alert("Failed to send donation. Please check the console for more details.");
        }
    };

    // Function to apply for a scholarship
    const applyForScholarship = async () => {
        try {
            if (name && amount && contract) {
                console.log("Applying for scholarship:", { name, amount });
                const tx = await contract.applyForScholarship(name, ethers.utils.parseEther(amount));
                await tx.wait();  // Wait for the transaction to be mined
                alert("Scholarship application submitted!");
                console.log("Application transaction:", tx);
            } else {
                alert("Please enter a valid name and amount.");
            }
        } catch (error) {
            console.error("Application failed:", error);
            alert("Failed to apply for scholarship. Please check the console for more details.");
        }
    };

    // Function to fetch and display student applications
    const fetchStudents = async () => {
        try {
            if (contract) {
                const studentsList = await contract.getStudents();
                setStudents(studentsList);
                console.log("Fetched student applications:", studentsList);
            }
        } catch (error) {
            console.error("Failed to fetch student applications:", error);
            alert("Error fetching applications. Please check the console for more details.");
        }
    };

    return (
        <div>
            <h2>EduFund: Decentralized Scholarship Fund</h2>
            <p>Connected account: {account}</p>

            <div>
                <h3>Donate to Scholarship Fund</h3>
                <input
                    type="text"
                    placeholder="Amount in ETH"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={donateFunds}>Donate</button>
            </div>

            <div>
                <h3>Apply for Scholarship</h3>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Amount in ETH"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={applyForScholarship}>Apply</button>
            </div>

            <div>
                <h3>View Student Applications</h3>
                <button onClick={fetchStudents}>Fetch Applications</button>
                <ul>
                    {students.map((student, index) => (
                        <li key={index}>
                            {student.name} - {ethers.utils.formatEther(student.requestedAmount)} ETH -{" "}
                            {student.approved ? "Approved" : "Pending"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
