// index.js —— NeuroLens API (final demo version)
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve 靜態檔 (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "public")));

// ===== Demo「資料來源」：問卷題目（你也可以維持 questions.json 方案 =====
const QUESTIONS = require("./questions.json");

// ===== In-memory 儲存提交（Demo 用；正式請改用 DB）=====
const submissions = []; // [{ ts: ISOString, answers: {...} }]

// --- 健康檢查 ---
app.get("/api/v1/ping", (req, res) => {
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

// --- 題目（前端 survey.html 會 fetch 呢個）---
app.get("/api/v1/questions", (req, res) => {
  res.json(QUESTIONS);
});

// --- 提交答案（survey.html 會 POST 到呢度）---
app.post("/api/v1/submit", (req, res) => {
  const answers = req.body?.answers;
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }

  submissions.push({
    ts: new Date().toISOString(),
    answers,
  });

  return res.json({ ok: true });
});

// --- 即時計算簡單統計（平均分、Yes/No、數值平均）---
app.get("/api/v1/stats", (req, res) => {
  // 統計容器
  const stats = {
    count: submissions.length,
    scale: {}, // { Q1: {sum, n, avg}, Q3: {...} ... }
    yesno: {}, // { Q2: {yes, no} ... }
    number: {}, // { Q4: {sum, n, avg, min, max} ... }
  };

  // 逐份提交掃
  for (const s of submissions) {
    const a = s.answers || {};
    // 遍歷每一題
    for (const q of QUESTIONS) {
      const qid = q.id;
      const v = a[qid];

      if (v === undefined || v === null || v === "") continue;

      if (q.type === "scale") {
        stats.scale[qid] ??= { sum: 0, n: 0, avg: 0 };
        stats.scale[qid].sum += Number(v);
        stats.scale[qid].n += 1;
      } else if (q.type === "yesno") {
        stats.yesno[qid] ??= { yes: 0, no: 0 };
        if (String(v).toLowerCase() === "yes") stats.yesno[qid].yes += 1;
        else stats.yesno[qid].no += 1;
      } else if (q.type === "number") {
        stats.number[qid] ??= { sum: 0, n: 0, avg: 0, min: Infinity, max: -Infinity };
        const num = Number(v);
        stats.number[qid].sum += num;
        stats.number[qid].n += 1;
        stats.number[qid].min = Math.min(stats.number[qid].min, num);
        stats.number[qid].max = Math.max(stats.number[qid].max, num);
      } else if (q.type === "multi") {
        // 如需統計多選可加：每個 option 的出現次數
        // 這個 Demo 先略過（保留擴充位）
      }
    }
  }

  // 計平均
  for (const k of Object.keys(stats.scale)) {
    const { sum, n } = stats.scale[k];
    stats.scale[k].avg = n ? +(sum / n).toFixed(2) : 0;
  }
  for (const k of Object.keys(stats.number)) {
    const { sum, n } = stats.number[k];
    stats.number[k].avg = n ? +(sum / n).toFixed(2) : 0;
    if (!n) {
      stats.number[k].min = 0;
      stats.number[k].max = 0;
    }
  }

  res.json(stats);
});

// --- 根路由頁（健康訊息）---
app.get("/", (req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// Listen（Render 會注入 PORT）
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
