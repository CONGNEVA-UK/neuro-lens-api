// index.js — NeuroLens API (final, array/object both supported)
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 讓 /public 底下的 HTML/CSS/JS 直接可訪問（/survey.html、/results.html）
app.use(express.static(path.join(__dirname, "public")));

// 題庫
const QUESTIONS = require("./questions.json");

// Demo 暫存提交（記憶體）；正式請改 DB
const submissions = []; // [{ ts, answersObj }]

// 健康檢查
app.get("/api/v1/ping", (req, res) => {
  res.json({ msg: "NeuroLens API is alive 🚀" });
});

// 題目
app.get("/api/v1/questions", (req, res) => {
  res.json(QUESTIONS);
});

// 將各種提交格式「標準化」成 {Q1: number/yes/no, ...}
function normalizeAnswers(raw) {
  if (!raw) return null;

  // case A: 已是物件
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw;
  }

  // case B: 係陣列 [{id, value}]
  if (Array.isArray(raw)) {
    const obj = {};
    for (const { id, value } of raw) {
      obj[id] = value;
    }
    return obj;
  }

  return null;
}

// 提交
app.post("/api/v1/submit", (req, res) => {
  const answersObj = normalizeAnswers(req.body?.answers);
  if (!answersObj) {
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }

  submissions.push({
    ts: Date.now(),
    answersObj,
  });

  // 兼容你現時前端的期望：回顯 payload 同 ts
  return res.json({
    ok: true,
    received: req.body,
    ts: Date.now(),
  });
});

// 統計
app.get("/api/v1/stats", (req, res) => {
  const stats = {
    count: submissions.length,
    scale: {},   // { Q1: {sum,n,avg} }
    yesno: {},   // { Q2: {yes,no} }
    number: {},  // { Q4: {sum,n,avg,min,max} }
  };

  const ynTrue = new Set(["1", "true", "yes", 1, true, "y"]); // 當作 Yes 的值

  for (const s of submissions) {
    const a = s.answersObj || {};
    for (const q of QUESTIONS) {
      const qid = q.id;
      let v = a[qid];
      if (v === undefined || v === null || v === "") continue;

      if (q.type === "scale") {
        const num = Number(v);
        stats.scale[qid] ??= { sum: 0, n: 0, avg: 0 };
        stats.scale[qid].sum += num;
        stats.scale[qid].n += 1;
      } else if (q.type === "yesno") {
        stats.yesno[qid] ??= { yes: 0, no: 0 };
        const isYes = ynTrue.has(
          typeof v === "string" ? v.toLowerCase() : v
        );
        if (isYes) stats.yesno[qid].yes += 1;
        else stats.yesno[qid].no += 1;
      } else if (q.type === "number") {
        const num = Number(v);
        stats.number[qid] ??= { sum: 0, n: 0, avg: 0, min: Infinity, max: -Infinity };
        stats.number[qid].sum += num;
        stats.number[qid].n += 1;
        stats.number[qid].min = Math.min(stats.number[qid].min, num);
        stats.number[qid].max = Math.max(stats.number[qid].max, num);
      }
      // multi（多選）如要統計可之後再加
    }
  }

  for (const k of Object.keys(stats.scale)) {
    const { sum, n } = stats.scale[k];
    stats.scale[k].avg = n ? +(sum / n).toFixed(2) : 0;
  }
  for (const k of Object.keys(stats.number)) {
    const { sum, n } = stats.number[k];
    stats.number[k].avg = n ? +(sum / n).toFixed(2) : 0;
    if (!n) { stats.number[k].min = 0; stats.number[k].max = 0; }
  }

  res.json(stats);
});

// 根頁
app.get("/", (req, res) => {
  res.send("✅ NeuroLens API is running!");
});

// 監聽（Render 會注入 PORT）
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API up at http://localhost:${PORT}`);
});
