import React from "react";
import { Card, CardContent, Box, Typography, LinearProgress } from "@mui/material";

const ProgressTask = ({ title, completed, total, barHeight }) => {
  const progress = (completed / total) * 100;
  return (
    <Box marginBottom="10px">
      <Typography variant="body1">{title}</Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        style={{
          marginTop: "5px",
          height: barHeight || "10px", // Default height is 10px
          borderRadius: "5px",
        }}
      />
      <Typography variant="caption" color="textSecondary">
        {`${completed}/${total}`}
      </Typography>
    </Box>
  );
};

const TaskBar = ({ tasks, barHeight, spacing }) => {
  return (
    <Box>
      {tasks.map((task, index) => (
        <ProgressTask
          key={index}
          title={task.title}
          completed={task.completed}
          total={task.total}
          barHeight={barHeight}
        />
      ))}
    </Box>
  );
};

export default TaskBar;
