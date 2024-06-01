import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import Quiz from "./components/Quiz";
import Home from "./components/Home"; // 引入 Home 組件

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:type" element={<Quiz />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
