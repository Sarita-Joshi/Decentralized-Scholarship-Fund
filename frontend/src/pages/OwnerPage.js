import React, { useState, useEffect } from "react";
import ApplicantTable from "../components/ApplicantTable/ApplicantTable";
import DonorTable from "../components/DonationTable/DonationTable";
import Footer from "../components/Footer/Footer";
import "./OwnerPage.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { approveApplication, disburseFunds, getUserAccount } from "../contractUtils";
import { updateAppStatus, getAllApplications } from "../dbUtils";
// import {
//     Chart as ChartJS,
//     ArcElement,
//     Tooltip,
//     Legend,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
// } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// // Register required elements
// ChartJS.register(
//     ArcElement,
//     Tooltip,
//     Legend,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement
// );

function OwnerPage() {
  const [applications, setApplications] = useState([]);
  const [donations, setDonations] = useState([]);
  const [account, setAccount] = useState(null);

  const [highestDonation, setHighestDonation] = useState(0);
  const [noOfFunds, setNoOfFunds] = useState(3); // Example static value
  const [noOfDonations, setNoOfDonations] = useState(0);
  const [metrics, setMetrics] = useState({
    totalApplicants: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalDonations: 0,
    disbursedFunds: 0,
    remainingFunds: 0,
  });

  useEffect(() => {
    // Fetch applications and donations data (mocked here for now)
    const fetchData = async () => {
      const userAccount = await getUserAccount();
      const appData = await getAllApplications();
      
      const donData = [
        {
          id: 1,
          donor: "0x1234",
          fund: "Education Fund",
          amount: 100,
          date: "2024-11-01",
        },
        {
          id: 2,
          donor: "0x2345",
          fund: "Health Fund",
          amount: 200,
          date: "2024-11-05",
        },
        {
          id: 3,
          donor: "0x3456",
          fund: "Community Fund",
          amount: 150,
          date: "2024-11-10",
        },
      ];
      setApplications(appData);
      setDonations(donData);

      // Calculate metrics
      const totalApplicants = appData.length;
      const approvedApplications = appData.filter(
        (app) => app.status === "Approved"
      ).length;
      const pendingApplications = appData.filter(
        (app) => app.status === "Pending"
      ).length;
      const rejectedApplications = appData.filter(
        (app) => app.status === "Rejected"
      ).length;

      const totalDonations = donData.reduce(
        (sum, donation) => sum + donation.amount,
        0
      );
      const disbursedFunds = appData
        .filter((app) => app.status === "Approved")
        .reduce((sum, app) => sum + app.amount, 0);
      const remainingFunds = totalDonations - disbursedFunds;

      setMetrics({
        totalApplicants,
        approvedApplications,
        pendingApplications,
        rejectedApplications,
        totalDonations,
        disbursedFunds,
        remainingFunds,
      });
    };

    fetchData();
  }, []);

  // // Donut chart data for applications
  // const applicationChartData = {
  //     labels: ["Approved", "Pending", "Rejected"],
  //     datasets: [
  //         {
  //             data: [
  //                 metrics.approvedApplications,
  //                 metrics.pendingApplications,
  //                 metrics.rejectedApplications,
  //             ],
  //             backgroundColor: ["#4caf50", "#ff9800", "#f44336"], // Colors for approved, pending, rejected
  //             hoverOffset: 4,
  //         },
  //     ],
  // };

  // // Donut chart data for funds
  // const fundChartData = {
  //     labels: ["Disbursed Funds", "Remaining Funds"],
  //     datasets: [
  //         {
  //             data: [metrics.disbursedFunds, metrics.remainingFunds],
  //             backgroundColor: ["#6a1b9a", "#8e24aa"], // Colors for disbursed vs remaining
  //             hoverOffset: 4,
  //         },
  //     ],
  // };
  // Handle application status updates
  const handleStatusChange = async (id, mongoHash, newStatus) => {
    console.log({ id, mongoHash, newStatus });
    const result = await approveApplication(id, newStatus);
    alert(result.message);

    if (result.success) {
      await updateAppStatus(mongoHash, newStatus);
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === mongoHash ? { ...app, status: newStatus } : app
        )
      );
    }
  };

  const handleDisbursement = async (id, mongoHash) => {
    console.log({ id, mongoHash });
    const result = await disburseFunds(id);
    alert(result.message);

    if (result.success) {
      await updateAppStatus(mongoHash, 'Funded');
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === mongoHash ? { ...app, status: 'Funded' } : app
        )
      );
    }
  };

  // Actions for approve/reject buttons
  const actions = {
    approve: async (row) => {
      alert(`Approving application ID: ${row._id}`);
      const appplicant = applications.filter((item) => item._id === row._id)[0];
      console.log(appplicant);
      // Here you would implement the logic to approve this application
      await handleStatusChange(
        appplicant.applicantId,
        appplicant._id,
        "Approved"
      );
    },
    reject:  async (row) => {
      alert(`Rejecting application ID: ${row._id}`);
      const appplicant = applications.filter((item) => item._id === row._id)[0];
      console.log(appplicant);
      // Here you would implement the logic to approve this application
      await handleStatusChange(
        appplicant.applicantId,
        appplicant._id,
        "Rejected"
      );
    },
    disburse: async (row) => {
      alert(`Sending funds to application ID: ${row._id}`);
      const appplicant = applications.filter((item) => item._id === row._id)[0];
      console.log(appplicant);
      // Here you would implement the logic to approve this application
      await handleDisbursement(
        appplicant.applicantId,
        appplicant._id
      );
    }
  };

  return (
    <div className="owner-page">
      <div className="donor-ribbon">

        <div className="stats-section">
          <div className="stat-card">
            <p className="badge badge1">Total Applications</p>
            <h3>{noOfDonations}</h3>
          </div>
          <div className="stat-card">
            <p className="badge badge2">Approved Applications</p>
            <h3>{noOfDonations} ETH</h3>
          </div>
          <div className="stat-card">
            <p className="badge badge3">Rejected Applications</p>
            <h3>{noOfFunds}</h3>
          </div>
          <div className="stat-card">
            <p className="badge badge4">Pending Applications</p>
            <h3>{highestDonation} ETH</h3>
          </div>
          <div className="stat-card">
            <p className="badge badge4">Available Funds</p>
            <h3>{highestDonation} ETH</h3>
          </div>
          <div className="stat-card">
            <p className="badge badge4">Distrubursed Funds</p>
            <h3>{highestDonation} ETH</h3>
          </div>
        </div>
        {/* Progress Bars Section */}
  <div className="progress-bars">
    <div className="progress-item">
      <p><span className="progress-heading">Pending Applications</span> ({metrics.pendingApplications} out of {metrics.totalApplicants})</p>
      
      <div className="progress-bar">
        <div
          className="progress-bar-filled"
          style={{
            width: `${
              (metrics.pendingApplications / metrics.totalApplicants) * 100
            }%`,
          }}
        ></div>
      </div>
    </div>

    <div className="progress-item">
      <p><span className="progress-heading">Pending Disbursement</span>({metrics.disbursementPending} out of {metrics.totalApplicants})</p>
      
      <div className="progress-bar">
        <div
          className="progress-bar-filled"
          style={{
            width: `${
              (metrics.disbursementPending / metrics.totalApplicants) * 100
            }%`,
          }}
        ></div>
      </div>
      
    </div>
  </div>

      </div>

      {/* Applicant Table */}
      <div className="table-container">
        <h3>Applicants</h3>
        <ApplicantTable
          data={applications}
          actions={actions}
          filters={{
            showSearch: true,
            showSort: true,
            showFilter: true,
            showActions: false,
            showOwner: true,
          }}
        />
      </div>

      {/* Donations Table */}
      <div className="table-container">
        <h3>Donations</h3>
        <DonorTable donations={donations} />
      </div>

      <Footer />
    </div>
  );
}

export default OwnerPage;
