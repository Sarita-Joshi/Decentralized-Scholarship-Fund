import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import StatCard from "../../components/StatCard/StatCard";
import TaskBar from "../../components/TaskBar/TaskBar";
import ApplicantTable from "../../components/ApplicantTable/ApplicantTable";
import DonationTable from "../../components/DonationTable/DonationTable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { approveApplication, disburseFunds, getUserAccount } from "../../contractUtils";
import { getAllDonations, getAllApplications } from "../../dbUtils";

const FundOwnerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [donations, setDonations] = useState([]);
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    fundedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalDonations: 0,
  });

  const stats = [
    {
      title: "Applications",
      icon: <AccessTimeIcon style={{ color: "#7E57C2" }} />,
      total: metrics.totalApplications,
      subCategories: `${metrics.totalApplications-metrics.fundedApplications} Active`,
    },
    {
      title: "Funds",
      icon: <VolunteerActivismIcon style={{ color: "#7E57C2" }} />,
      total: `${metrics.totalDonations} ETH`,
      subCategories: "Across Active Donations",
    },
    {
      title: "Donations",
      icon: <PaymentIcon style={{ color: "#7E57C2" }} />,
      total: `${metrics.totalDonations} ETH`,
      subCategories: "Total Contributions",
    },
    {
      title: "Reviewers",
      icon: <PeopleAltIcon style={{ color: "#7E57C2" }} />,
      total: "15",
      subCategories: "Active Reviewers",
    },
  ];

  const tasks = [
    { title: "Waiting Approval", completed: (metrics.totalApplications-metrics.pendingApplications), total: metrics.totalApplications },
    { title: "Waiting Disbursement", completed: metrics.approvedApplications, total: (metrics.approvedApplications+ metrics.fundedApplications) },
  ];

  const profile = {
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Blockchain Avenue, Ethereum City",
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userAccount = await getUserAccount();
      const appData = await getAllApplications(); // Fetch all applications
      const donationData = await getAllDonations(); // Fetch all donations

      // Update state with fetched data
      setApplications(appData);
      setDonations(donationData);

      // Calculate metrics
      const totalApplications = appData.length;
      const approvedApplications = appData.filter(app => app.status === "Approved").length;
      const fundedApplications = appData.filter(app => app.status === "Funded").length;
      const pendingApplications = appData.filter(app => app.status === "Pending").length;
      const rejectedApplications = appData.filter(app => app.status === "Rejected").length;
      const totalDonations = donationData.reduce((sum, donation) => sum + donation.amount, 0);

      setMetrics({
        totalApplications,
        approvedApplications,
        fundedApplications,
        pendingApplications,
        rejectedApplications,
        totalDonations,
      });
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Purple Header */}
      <Box
        style={{
          backgroundColor: "#7E57C2",
          padding: "30px",
          color: "#fff",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Profile Card */}
          <Card
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "10px",
              marginRight: "20px",
            }}
          >
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={profile.name}
                src="https://via.placeholder.com/100"
                style={{
                  width: "80px",
                  height: "80px",
                  marginRight: "15px",
                }}
              />
              <Box>
                <Typography variant="h6" style={{ color: "#333" }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" style={{ color: "#666" }}>
                  {profile.email}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: "#999", marginTop: "10px" }}
                >
                  {profile.address}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Stat Cards */}
          <Box display="flex" gap="20px">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                icon={stat.icon}
                total={stat.total}
                subCategories={stat.subCategories}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main Section */}
      <Box display="flex" justifyContent="space-between" marginTop="20px">
        {/* Progress Tracker */}
        <Card
          style={{
            flex: "0 0 30%",
            borderRadius: "10px",
            padding: "20px",
            background: "linear-gradient(145deg, #f4f4f4, #ffffff)",
            boxShadow: "5px 5px 10px #e0e0e0, -5px -5px 10px #ffffff",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              borderLeft: "5px solid #7E57C2",
              paddingLeft: "10px",
              marginBottom: "10px",
            }}
          >
            Progress Tracker
          </Typography>
          <TaskBar tasks={tasks} />
        </Card>
      </Box>

      {/* Tables Section */}
      <Box display="flex" justifyContent="space-between" marginTop="20px">
        {/* Pending Applications */}
        <Card
          style={{
            flex: "0 0 65%",
            borderRadius: "10px",
            padding: "20px",
            background: "linear-gradient(145deg, #f4f4f4, #ffffff)",
            boxShadow: "5px 5px 10px #e0e0e0, -5px -5px 10px #ffffff",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              borderLeft: "5px solid #7E57C2",
              paddingLeft: "10px",
              marginBottom: "10px",
            }}
          >
            Pending Applications
          </Typography>
          <ApplicantTable data={applications} actions={{}} filters={{ showSearch: true }} />
        </Card>

        {/* Recent Donations */}
        <Card
          style={{
            flex: "0 0 30%",
            borderRadius: "10px",
            padding: "20px",
            background: "linear-gradient(145deg, #f4f4f4, #ffffff)",
            boxShadow: "5px 5px 10px #e0e0e0, -5px -5px 10px #ffffff",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              borderLeft: "5px solid #7E57C2",
              paddingLeft: "10px",
              marginBottom: "10px",
            }}
          >
            Recent Donations
          </Typography>
          <DonationTable data={donations} />
        </Card>
      </Box>
    </div>
  );
};

export default FundOwnerDashboard;
