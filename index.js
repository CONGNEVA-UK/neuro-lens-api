// index.js (FINAL with pretty switch)

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 靜態檔案
app.use(express.static(path.join(__dirname, "public")));

// 小工具：根據 ?pretty=1 決定是否美化輸出
function sendJson(req, res, data) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const pretty = "pretty" in req.query; // 有任何值都當開啟
  res.send(JSON.stringify(data, null, pretty ? 2 : 0));
}

// 根路由
app.get("/", (_req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// PING
app.get("/api/v1/ping", (req, res) => {
  sendJson(req, res, { msg: "NeuroLens API is alive 🚀" });
});

// 題目
app.get("/api/v1/questions", (req, res) => {
  const questions = require("./questions.json");
  sendJson(req, res, questions);
});

// 提交
app.post("/api/v1/submit", (req, res) => {
  sendJson(req, res, { ok: true, received: req.body || {}, ts: Date.now() });
});

// 監聽
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
