import React, { useState, useEffect } from 'react';
import './DonorPage.css';
import FundCard from '../components/FundCard/FundCard';
import Header from "../components/Header/Header";
import CreateFundModal from '../components/CreateFundModal/CreateFundModal';
import Dialog from '../components/Dialog/Dialog';
import Footer from '../components/Footer/Footer';
import { makeDonation, getUserAccount, CreateFundOnChain } from "../contractUtils";
import { createDonation, createFundMongo, getAllApplications, getAllFunds, getMetricsMongo } from '../dbUtils';
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

            // const totalDonations = donationData.reduce(
            //     (sum, donation) => sum + donation.Amount,
            //     0
            // );
            const metrics_ = await getMetricsMongo({donorAddress: userAccount});
            setMetrics(metrics_);

            console.log(metrics_);

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
          } Active, ${metrics.fundedApplications} Funded`,
        },
        {
          title: "Requested Amount",
          icon: <VolunteerActivismIcon style={{ color: "#7E57C2" }} />,
          total: `${metrics.totalApplicationAmount} ETH`,
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
          total: topFunds.length,
          subCategories: "Active Funds",
        },
      ];


    const profile = {
        name: "John Doe",
        email: "john.doe@example.com",
        address: "123 Blockchain Avenue, Ethereum City",
      };

    const cta = {
        label: "Create New Fund",
        onClick: () => setIsCreateFundModalOpen(true),
      };

    const openDialog = (fund) => {
        setSelectedFund(fund);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setDonationAmount("");
    };

    const donateFunds = async (fund) => {
        try {
            console.log(`donatiingg...${selectedFund?.title}  ${fund?.title}`)
            const fundName = selectedFund?.title;
            const fundOwner = selectedFund?.fundOwner;
            const fundId = selectedFund?.id;

            const result = await makeDonation(donationAmount, fundId);
            console.log(`donated...${selectedFund?.title}`)
            
            if (result.success) {
                await createDonation({
                    "donorAddress": account,
                    "amount": donationAmount,
                    "fundOwner": fundOwner,
                    "fundName": fundName,
                    "fundId": fundId,
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
            <Header profile={profile} stats={stats} cta={cta}/>

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
                            minimumApprovals={fund.minApprovals}
                            autoDisburse={fund.autoDisburseFunds}
                            buttonLabel={null}
                            onDonate={() => {openDialog(fund)}}
                        />
                    ))}
                </div>
            </div>

            {isDialogOpen && (
                <Dialog
                    title={`Donate to ${selectedFund.title}`}
                    onConfirm={() => donateFunds(selectedFund) }
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
