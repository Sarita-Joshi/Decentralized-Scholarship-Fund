import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ title, icon, total, subCategories, cardStyle }) => {
  return (
    <Card
      style={{
        flex: "1",
        margin: "10px",
        textAlign: "left",
        borderRadius: "10px",
        ...cardStyle, // Accept custom styles
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" color="textSecondary" fontWeight="550">
            {title}
          </Typography>
          <Box
            style={{
              backgroundColor: "#F3E8FF",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          variant="h4"
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          {total}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {subCategories}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
