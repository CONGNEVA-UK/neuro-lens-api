const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 👇 新增這行：所有 JSON 回應會有 2 空格縮排
app.set("json spaces", 2);

// Serve 靜態檔案 (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// 測試 API
app.get("/api/v1/ping", (req, res) => {
  console.log("PING hit");
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

// 問卷 API
app.get("/api/v1/questions", (req, res) => {
  const questions = require("./questions.json");
  res.json(questions);
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
