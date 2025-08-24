const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 服侍 /public 靜態檔（HTML/CSS/JS）
app.use(express.static(path.join(__dirname, "public")));

// --- API --- //
app.get("/api/v1/ping", (req, res) => {
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

app.get("/api/v1/questions", (req, res) => {
  try {
    const questions = require("./questions.json"); // 確保 questions.json 是有效 JSON
    res.json(questions);
  } catch (e) {
    console.error("Load questions error:", e);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

// 根路由（Health Check）
app.get("/", (req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// 監聽 Render 分配的 PORT（必要）
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
