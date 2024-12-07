import React, { useState, useEffect } from 'react';
import './DonorPage.css';
import FundCard from '../components/FundCard/FundCard';
import Header from "../components/Header/Header";
import CreateFundModal from '../components/CreateFundModal/CreateFundModal';
import Dialog from '../components/Dialog/Dialog';
import Footer from '../components/Footer/Footer';
import { makeDonation, getUserAccount, CreateFundOnChain } from "../contractUtils";
import { createDonation, createFundMongo, getAllFunds } from '../dbUtils';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

function DonorPage() {
    const [donationAmount, setDonationAmount] = useState("");
    const [account, setAccount] = useState(null);
    const [selectedFund, setSelectedFund] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateFundModalOpen, setIsCreateFundModalOpen] = useState(false);
    const [topFunds, setTopFunds] = useState([]);
    const [metrics, setMetrics] = useState({
        totalApplications: 0,
        totalApplicationAmount:0,
        requiredAmount:0,
        approvedApplications: 0,
        fundedApplications: 0,
        pendingApplications: 0,
        rejectedApplications: 0,
        totalDonations: 0,
      });

    useEffect(() => {
        const loadData = async () => {
            const userAccount = await getUserAccount();
            setAccount(userAccount);

            const funds = await getAllFunds('true');
            console.log(funds);
            setTopFunds(funds)

        };
        loadData();
    }, []);

    const stats = [
        {
          title: "Applications",
          icon: <AccessTimeIcon style={{ color: "#7E57C2" }} />,
          total: metrics.totalApplications,
          subCategories: `${
            metrics.totalApplications - metrics.fundedApplications
          } Active`,
        },
        {
          title: "Requested Amount",
          icon: <VolunteerActivismIcon style={{ color: "#7E57C2" }} />,
          total: `${metrics.totalDonations} ETH`,
          subCategories: "Across all funds",
        },
        {
          title: "Your Donations",
          icon: <PaymentIcon style={{ color: "#7E57C2" }} />,
          total: `${metrics.totalDonations} ETH`,
          subCategories: "Total Contributions",
        },
        {
          title: "Active Funds",
          icon: <PeopleAltIcon style={{ color: "#7E57C2" }} />,
          total: "15",
          subCategories: "Active Funds",
        },
      ];


    const profile = {
        name: "John Doe",
        email: "john.doe@example.com",
        address: "123 Blockchain Avenue, Ethereum City",
      };
    




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
            const result = makeDonation(donationAmount);

            if (result.success) {
                createDonation({
                    "donorAddress": account,
                    "amount": donationAmount,
                    // "fund": selectedFund,
                });
            }

            closeDialog();


        } catch (error) {
            console.error("Donation failed:", error);
            alert("Failed to process donation. Please check console for details.");
        }
    };

    const validateSection = (formData) => {
        return []
    }

    const handleCreateFundSubmit = async (formData) => {
        
            let errors = validateSection(formData);
            if (Object.keys(errors).length === 0) {
                console.log("Fund Created:", formData);
                formData.fundOwner = account;
                console.log({formData, account});
                const result = await CreateFundOnChain(formData);
                if (result.success) {
                    alert(result.message);
                    console.log({id:result.id, log:'sdsdgdsgsdsg'})
                    const newFund = await createFundMongo({...formData, fundId: result.id.toString()});

                    setTopFunds([...topFunds, newFund])
                } else {
                    alert(result.message);
                }
                
            } else {
                alert("Please complete all sections before submitting.");
            }
        };

    
    

    return (
                    <div className="donor-page">
            {/* Top Ribbon with Profile and Stats */}
            <Header profile={profile} stats={stats} />

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
                            buttonLabel={null}
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

            {isCreateFundModalOpen && (
                <CreateFundModal
                    isOpen={isCreateFundModalOpen}
                    onClose={() => setIsCreateFundModalOpen(false)}
                    onSubmit={handleCreateFundSubmit}
                />
            )}
        <Footer />
        </div>
    );
}

export default DonorPage;
