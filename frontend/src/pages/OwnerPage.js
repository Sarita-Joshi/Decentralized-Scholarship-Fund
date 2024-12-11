import React, { useState, useEffect } from "react";
import ApplicantTable from "../components/ApplicantTable/ApplicantTable";
import Footer from "../components/Footer/Footer";
import "./OwnerPage.css";
import {
  getUserAccount,
  approveApplication,
  disburseFunds,
} from "../contractUtils";
import {
  getAllApplications,
  getAllFunds,
  getMetricsMongo,
  updateAppStatus,
} from "../dbUtils";
import Header from "../components/Header/Header";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

function OwnerPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [topFunds, setTopFunds] = useState([]);
  const [selectedFundIds, setSelectedFundIds] = useState([]);
  const [account, setAccount] = useState(null);
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    totalApplicationAmount: 0,
    requiredAmount: 0,
    approvedApplications: 0,
    fundedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalDonations: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const userAccount = await getUserAccount();
      setAccount(userAccount);

      const appData = await getAllApplications();
      setApplications(appData);
      setFilteredApplications(appData);

      const funds = await getAllFunds("true");
      setTopFunds(funds);

      const metrics_ = await getMetricsMongo({ donorAddress: userAccount });
      setMetrics(metrics_);

      console.log(["hiiii", funds, appData[0]]);
    };

    fetchData();
  }, []);

  // Filter applications when selectedFundIds changes
  useEffect(() => {
    if (selectedFundIds.length > 0) {
      const filtered = applications.filter((app) =>
        selectedFundIds.includes(app.fundId)
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications); // Show all if no fund is selected
    }
  }, [selectedFundIds, applications]);

  const toggleFundSelection = (fundId) => {
    setSelectedFundIds((prev) =>
      prev.includes(fundId)
        ? prev.filter((id) => id !== fundId)
        : [...prev, fundId]
    );
  };

  const actions = {
    approve: async (row) => {
      const app = applications.find((app) => app._id === row._id);
      const response = await approveApplication(app.applicantId, true);
  
      if (response.success) {
        let newStatus = "Approved";
  
        // Check if the application was auto-disbursed
        if (response.autoDisbursed) {
          newStatus = "Funded";
        }
  
        // Update the frontend state
        setFilteredApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === row._id ? { ...app, status: newStatus } : app
          )
        );
  
        // Update MongoDB with the new status
        await updateAppStatus(app.applicantId, newStatus, account);
      } else {
        console.error(response.message);
      }
    },
  
    reject: async (row) => {
      const app = applications.find((app) => app._id === row._id);
      const response = await approveApplication(app.applicantId, false);
  
      if (response.success) {
        // Update the frontend state
        setFilteredApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === row._id ? { ...app, status: "Rejected" } : app
          )
        );
  
        // Update MongoDB with the rejected status
        await updateAppStatus(app._id, "Rejected", account);
      } else {
        console.error(response.message);
      }
    },
  
    disburse: async (row) => {
      const app = applications.find((app) => app._id === row._id);
      const response = await disburseFunds(app.applicantId);
  
      if (response.success) {
        // Update the frontend state
        setFilteredApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === row._id ? { ...app, status: "Funded" } : app
          )
        );
  
        // Update MongoDB with the funded status
        await updateAppStatus(app._id, "Funded", account);
      } else {
        console.error(response.message);
      }
    },
  };
  

  const getRandomColor = (index) => {
    const colors = [
      "#FF8A80", // Light Red
      "#FF80AB", // Pink
      "#B388FF", // Light Purple
      "#8C9EFF", // Light Blue
      "#80D8FF", // Aqua
      "#A7FFEB", // Teal
      "#CCFF90", // Light Green
      "#FFFF8D", // Yellow
    ];
    return colors[index % colors.length]; // Cycle through the color palette
  };

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

  return (
    <div className="owner-page">
      {/* Top Ribbon with Profile and Stats */}
      <Header profile={profile} stats={stats} />

      {/* Horizontal Fund Slider */}

      <div className="compact-slider-section">
        <h2 className="compact-slider-title">Filter by Funds</h2>
        <div className="compact-slider-container">
          {topFunds.map((fund, index) => (
            <div
              key={fund.id}
              className={`compact-fund-card ${
                selectedFundIds.includes(fund.id) ? "selected" : ""
              }`}
              onClick={() => toggleFundSelection(fund.id)}
            >
              <div className="compact-fund-left">
                <div 
                className="compact-fund-circle"
                style={{
                  backgroundColor: getRandomColor(index), // Set random color dynamically
                }}>
                  {fund.title.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="compact-fund-right">
                <h3 className="compact-fund-title">{fund.title}</h3>
                <p className="compact-fund-subtitle">{fund.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applicant Table */}
      <div className="table-container">
        <h3>Applicants</h3>
        <ApplicantTable
          data={filteredApplications}
          actions={actions}
          filters={{
            showSearch: true,
            showSort: true,
            showFilter: true,
            showActions: true,
          }}
        />
      </div>

      <Footer />
    </div>
  );
}

export default OwnerPage;
