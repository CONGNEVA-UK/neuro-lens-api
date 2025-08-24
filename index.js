// index.js (FINAL OVERWRITE)

const express = require("express");
const cors = require("cors");
const path = require("path");

// --- App setup ---
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML/CSS/JS) from /public
app.use(express.static(path.join(__dirname, "public")));

// 根路由：簡單健康檢查（純文字）
app.get("/", (_req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// PING：回傳乾淨 JSON（不用 Render 的 pretty viewer）
app.get("/api/v1/ping", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ msg: "NeuroLens API is alive 🚀" }));
});

// 問卷題目：讀取本地 questions.json 並回傳乾淨 JSON
app.get("/api/v1/questions", (_req, res) => {
  // 用 require 讀本地 JSON（部署後足夠；如需熱更新可改用 fs.readFile）
  const questions = require("./questions.json");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(questions));
});

// 表單提交示例：接收答案（你之後可改為寫入 DB）
app.post("/api/v1/submit", (req, res) => {
  const payload = req.body || {};
  // 這裡先回聲（echo）返你傳入的資料
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ ok: true, received: payload, ts: Date.now() }));
});

// --- Listen 必須最後 ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
