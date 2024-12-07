import React from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import logo from '../../assets/logo2.png';
import StatCard from "../StatCard/StatCard";

const Header = ({ profile, stats, cta }) => {
  return (
    <Box>
      {/* Purple Header */}
      <Box
  style={{
    backgroundColor: "#7E57C2",
    height: "120px",
    padding: "10px",
    color: "#fff",
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
  }}
>
  {/* Logo */}
  <Box style={{ display: "flex", alignItems: "center" }}>
    <img
      src={logo}
      alt="Logo"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        marginRight: "10px",
      }}
    />
    <Typography variant="h6" style={{ color: "#fff" }}>
      EduFund
    </Typography>
  </Box>

  {/* Profile Info */}
  <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <Box style={{ textAlign: "right" }}>
      {cta && (<button
        style={{
          padding: "8px 10px",
          width: "fit-content",
          marginRight: "30px",
          borderRadius: "5px",
          color: "#6c63ff",
          backgroundColor: "#fefefe",
          fontWeight: 700,
        }}
        onClick={cta.onClick}
      >
      {cta.label}
      </button>)}
    </Box>
    <Box style={{ textAlign: "right" }}>
      <Typography variant="body1" style={{ color: "#fff", fontWeight: "bold" }}>
        {profile.name}
      </Typography>
      <Typography
        variant="body2"
        style={{ color: "#ccc", fontSize: "0.9em" }}
      >
        {profile.email}
      </Typography>
    </Box>
    <Avatar
      alt={profile.name}
      src="https://via.placeholder.com/50"
      style={{
        width: "40px",
        height: "40px",
        border: "2px solid #fff", // Optional: Add a white border for contrast
      }}
    />
  </Box>
</Box>
      {/* Stat Cards - Positioned below header and pulled up */}
      <Box
        display="flex"
        gap="20px"
        style={{
          position: "relative",
          marginTop: "-70px", // Pull cards up to overlap
          zIndex: 2, // Ensure cards appear above the header
          padding: "0 30px", // Add some padding for alignment
        }}
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            icon={stat.icon}
            total={stat.total}
            subCategories={stat.subCategories}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Header;
