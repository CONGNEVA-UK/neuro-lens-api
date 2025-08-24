// index.js — FINAL (overwrite this file)

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// 1) Static files — serves anything inside /public
//    e.g. https://<your-app>.onrender.com/demo.html or /survey.html
app.use(express.static(path.join(__dirname, "public")));

// 2) Health check
app.get("/api/v1/ping", (req, res) => {
  console.log("PING hit");
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

// 3) Questions API — reads questions.json (must sit next to index.js)
app.get("/api/v1/questions", (req, res) => {
  try {
    const filePath = path.join(__dirname, "questions.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to read questions.json:", err);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

// 4) (Optional) Submit endpoint — echoes payload
app.post("/api/v1/submit", (req, res) => {
  console.log("SUBMIT payload:", req.body);
  res.json({ ok: true, received: req.body });
});

// 5) Root
app.get("/", (req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// 6) Listen (keep this last)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
