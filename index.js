const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 測試用 API
app.get("/api/v1/ping", (req, res) => {
  console.log("PING hit");
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

// 根路由
app.get("/", (req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// 🚨 Listen 一定要放最後
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
