import React, { useState, useEffect } from 'react';
import RecordTable from '../components/RecordTable';
import './DonorPage.css';
import { makeDonation, getUserAccount } from "../contractUtils";
import { createDonation, getAllDonations, getApprovedApplications, getTotalDonationsMongo } from '../dbUtils';

function DonorPage() {
    const [donationAmount, setDonationAmount] = useState("");
    const [totalDonations, setTotalDonations] = useState(0);
    const [donationList, setDonationList] = useState([]);


    useEffect(() => {
        const loadData = async () => {
            const total = await getTotalDonationsMongo();
            setTotalDonations(total);

            // const appData = await getApprovedApplications();
            // setApplications(appData);

            const donData = await getAllDonations();
            setDonationList(donData);

            console.log(total);
            console.log(donData);
        };
        loadData();
    }, []);

    
    
    // Columns for RecordTable
    const columns = ["id", "Donor Address", "Amount", "Date"];

    // Actions for RecordTable
    const actions = [];


    const donateFunds = async () => {
        try {
            const result = makeDonation(donationAmount);
            alert(result.message);

            const account = await getUserAccount();

            if (result.success) {
                createDonation({
                    "donorAddress": account,
                    "amount": donationAmount,
                });

                // Refresh total donations and donations list
                const total = getTotalDonationsMongo();
                setTotalDonations(total);

                const donationsList = getAllDonations();
                setDonationList(donationsList);
            }


        } catch (error) {
            console.error("Donation failed:", error);
            alert("Failed to process donation. Please check console for details.");
        }
    };
    

    return (
        <div>
            <h2>Donor Dashboard</h2>
            <p>Thank you for considering a donation. Your support helps fund scholarships for students in need!</p>

            <div>
                <h3>Make a Donation</h3>
                <input
                    type="text"
                    placeholder="Enter donation amount (ETH)"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                />
                <button onClick={donateFunds}>Donate</button>
            </div>

            <div>
                <h3>All Donations-</h3>
                <RecordTable data={donationList} columns={columns} actions={actions} />
            </div>
        </div>
    );
}

export default DonorPage;
