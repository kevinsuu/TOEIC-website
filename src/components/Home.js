import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (type) => {
    navigate(`/quiz/${type}`);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h3" gutterBottom>
        多益3000單字測驗
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleNavigate("cn-to-en")} style={{ marginBottom: "10px", width: "200px" }}>
        中文翻英文
      </Button>
      <Button variant="contained" color="secondary" onClick={() => handleNavigate("en-to-cn")} style={{ marginBottom: "10px", width: "200px" }}>
        英文翻中文
      </Button>
    </Box>
  );
};

export default Home;
