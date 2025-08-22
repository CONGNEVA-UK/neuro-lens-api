const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// --- 靜態檔案支援 (serve public folder) ---
app.use(express.static(path.join(__dirname, "public")));

// --- 測試用 API ---
app.get("/api/v1/ping", (req, res) => {
  console.log("PING hit");
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

// --- 問卷：讀取 JSON 檔 ---
app.get("/api/v1/questions", (req, res) => {
  const filePath = path.join(__dirname, "questions.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Read questions error:", err);
      return res.status(500).json({ error: "讀取問卷失敗" });
    }
    try {
      const q = JSON.parse(data);
      res.json(q);
    } catch (e) {
      console.error("Parse questions error:", e);
      res.status(500).json({ error: "問卷格式錯誤" });
    }
  });
});

// --- Demo 提交：收 answers ---
app.post("/api/v1/submit", (req, res) => {
  const payload = {
    receivedAt: new Date().toISOString(),
    answers: req.body?.answers ?? null,
    meta: req.body?.meta ?? {}
  };
  console.log("📝 Demo submission:", JSON.stringify(payload, null, 2));
  res.json({ ok: true, msg: "Demo 已收到提交", echo: payload });
});

// --- 根路由 ---
app.get("/", (req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// 🚨 Listen 一定要放最後
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
