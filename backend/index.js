const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const questionfromfrontend = req.body;
  console.log("questionfromfrontend", questionfromfrontend);
  const promptdata = questionfromfrontend;
  try {
    const response = await axios.post(
      "http://localhost:11434/api/chat",
      req.body
    );
    console.log(req.body);
    res.json(response.data);
  } catch (error) {
    console.error("error communicating with ollama:", error.message);
    res.status(500).json({ error: "failed to reach ollama api" });
  }
});

app.listen(port, () => {
  console.log(`middleware server running at http://localhost: ${port}`);
});
