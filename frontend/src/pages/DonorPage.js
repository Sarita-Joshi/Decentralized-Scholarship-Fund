import React, { useState, useEffect } from 'react';
import './DonorPage.css';
import FundCard from '../components/FundCard/FundCard';
import CreateFund from '../components/CreateFund/CreateFund';
import Dialog from '../components/Dialog/Dialog';
import Footer from '../components/Footer/Footer';
import { donateToFund, getUserAccount } from "../contractUtils";
import { createDonation, getAllDonations, getTotalDonationsMongo } from '../dbUtils';

function DonorPage() {
    const [donationAmount, setDonationAmount] = useState("");
    const [totalDonations, setTotalDonations] = useState(0);
    const [donationList, setDonationList] = useState([]);
    const [highestDonation, setHighestDonation] = useState(0);
    const [noOfFunds, setNoOfFunds] = useState(3); // Example static value
    const [noOfDonations, setNoOfDonations] = useState(0);
    const [selectedFund, setSelectedFund] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [topFunds, setTopFunds] = useState([]);
    const [isCreateFundOpen, setIsCreateFundOpen] = useState(false);

    const openCreateFund = () => setIsCreateFundOpen(true);
    const closeCreateFund = () => setIsCreateFundOpen(false);

    useEffect(() => {
        const loadData = async () => {
            const total = await getTotalDonationsMongo();
            setTotalDonations(total);

            const donations = await getAllDonations();
            setDonationList(donations);

            // Calculate highest donation and number of donations
            if (donations.length > 0) {
                setHighestDonation(
                    Math.max(...donations.map((donation) => parseFloat(donation.amount)))
                );
                setNoOfDonations(donations.length);
            }

            // Example data for top funds
            setTopFunds([
                {
                    id: 1,
                    banner: null,
                    title: "Education Fund",
                    subtitle: "Support students in need of financial aid.",
                    totalFunds: 10,
                    totalApplicants: 50,
                    fundsNeeded: 20,
                },
                {
                    id: 2,
                    banner: null,
                    title: "Health Fund",
                    subtitle: "Help communities with better healthcare facilities.",
                    totalFunds: 5,
                    totalApplicants: 30,
                    fundsNeeded: 15,
                },
                {
                    id: 3,
                    banner: null,
                    title: "Animal Welfare Fund",
                    subtitle: "Protect and care for animals in need.",
                    totalFunds: 2,
                    totalApplicants: 10,
                    fundsNeeded: 10,
                },
            ]);
        };
        loadData();
    }, []);


    const openDialog = (fundName) => {
        setSelectedFund(fundName);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setDonationAmount("");
    };

    const donateFunds = async () => {
        try {
            const result = donateToFund(donationAmount);
            const account = await getUserAccount();

            if (result.success) {
                createDonation({
                    "donorAddress": account,
                    "amount": donationAmount,
                    // "fund": selectedFund,
                });

                // Refresh total donations and donations list
                const total = getTotalDonationsMongo();
                setTotalDonations(total);

                const donationsList = getAllDonations();
                setDonationList(donationsList);
            }

            closeDialog();


        } catch (error) {
            console.error("Donation failed:", error);
            alert("Failed to process donation. Please check console for details.");
        }
    };
    

    return (
            <div className="donor-page">
            {/* Top Ribbon with Profile and Stats */}
            <div className="donor-ribbon">
                <div className="profile-section">
                    <img
                        src="https://via.placeholder.com/100" // Replace with actual avatar
                        alt="Donor Avatar"
                        className="donor-avatar"
                    />
                    <div className="profile-details">
                        <h3>John Doe</h3>
                        <p>Email: john.doe@example.com</p>
                        <p>Address: <strong>0xABC123...XYZ</strong></p>
                    </div>
                    <button onClick={openCreateFund}>Create New Fund</button>

                </div>
                <div className="stats-section">
                    <div className="stat-card">
                        <p className='badge badge1'>No of Donations</p>
                        <h3>{noOfDonations}</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge2'>Total Amount</p>
                        <h3>{totalDonations} ETH</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge3'>No of Funds</p>
                        <h3>{noOfFunds}</h3>
                    </div>
                    <div className="stat-card">
                    <p className='badge badge4'>Highest Donation</p>
                        <h3>{highestDonation} ETH</h3>
                    </div>
                </div>
            </div>

            {/* Top Funds Section */}
            <div className="donation-cards">
                <h2 className='top-funds-heading'>Top Funds to Donate</h2>
                <div className="cards-container">
                    {topFunds.map((fund) => (
                        <FundCard
                            key={fund.id}
                            banner={fund.banner}
                            title={fund.title}
                            subtitle={fund.subtitle}
                            totalFunds={fund.totalFunds}
                            totalApplicants={fund.totalApplicants}
                            fundsNeeded={fund.fundsNeeded}
                            onDonate={() => {openDialog(fund.title)}}
                        />
                    ))}
                </div>
            </div>

            {isDialogOpen && (
                <Dialog
                    title={`Donate to ${selectedFund}`}
                    onConfirm={donateFunds}
                    onCancel={closeDialog}
                >
                    <p>Enter the amount you want to donate (in ETH):</p>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                    />
                </Dialog>
            )}
        <Footer />

        <CreateFund isOpen={isCreateFundOpen} onClose={() => setIsCreateFundOpen(false)} />
        </div>
    );
}

export default DonorPage;
