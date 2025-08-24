// index.js — FINAL (clean UI + clean JSON)

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 靜態檔：/public 下的 HTML/CSS/JS 可直接以 URL 存取（/survey.html）
app.use(express.static(path.join(__dirname, "public")));

// 根路由（健康檢查，純文字）
app.get("/", (_req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// PING（乾淨 JSON，避免 Render 黑底包裝）
app.get("/api/v1/ping", (_req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify({ msg: "NeuroLens API is alive" }));
});

// 題目（讀取根目錄的 questions.json，乾淨 JSON）
app.get("/api/v1/questions", (_req, res) => {
  try {
    const questions = require("./questions.json");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(JSON.stringify(questions));
  } catch (e) {
    console.error("Load questions error:", e);
    res.status(500).json({ error: "Failed to load questions.json" });
  }
});

// 提交（Demo：回聲你提交的答案）
app.post("/api/v1/submit", (req, res) => {
  const payload = req.body || {};
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify({ ok: true, received: payload, ts: Date.now() }));
});

// 監聽（Render 會注入 PORT；請勿改）
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
