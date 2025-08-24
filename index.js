const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// serve /public (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// health checks
app.get("/api/v1/ping", (req, res) => {
  console.log("PING hit");
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

app.get("/", (req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// -------- Questionnaire API --------

// GET /api/v1/questions  → return questions.json
app.get("/api/v1/questions", (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "questions.json");
    const data = fs.readFileSync(jsonPath, "utf-8");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(data); // already valid JSON string
  } catch (e) {
    console.error("Read questions error:", e);
    res.status(500).json({ error: "Failed to read questions.json" });
  }
});

// POST /api/v1/submit  → accept answers and return a simple score
app.post("/api/v1/submit", (req, res) => {
  const { answers } = req.body; // e.g. [{id:"Q1", value:3}, ...]
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: "answers must be an array" });
  }

  // demo scoring: sum numeric values
  let sum = 0;
  let count = 0;
  for (const a of answers) {
    const v = Number(a?.value);
    if (!Number.isNaN(v)) {
      sum += v;
      count += 1;
    }
  }
  const avg = count ? +(sum / count).toFixed(2) : 0;

  res.json({
    ok: true,
    items: count,
    sum,
    avg,
    note: "Demo score only — replace with real logic later.",
  });
});

// -----------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
