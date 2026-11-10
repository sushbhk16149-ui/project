
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = "mongodb://127.0.0.1:27017/stressiq";

// Models
const User = mongoose.models.User || mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    createdAt: { type: Date, default: Date.now }
  })
);

const Assessment = mongoose.models.Assessment || mongoose.model(
  "Assessment",
  new mongoose.Schema({
    userId: String,
    answers: mongoose.Schema.Types.Mixed,
    score: Number,
    level: String,
    topFactors: Array,
    responseCount: Number,
    date: { type: Date, default: Date.now }
  })
);

// Root route
app.get("/", (req, res) => {
  res.send("StressIQ backend is running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    database: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected"
  });
});

// API test
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "StressIQ API is working!"
  });
});

// Login / create user
app.post("/api/login", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        passwordHash: password
      });
    } else if (user.passwordHash !== password) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    res.json({
      id: normalizedEmail,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Could not save user"
    });
  }
});

// Submit stress assessment
app.post("/api/submit", async (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!userId || answers == null) {
      return res.status(400).json({
        error: "User and answers required"
      });
    }

    const values = Array.isArray(answers)
      ? answers
      : Object.values(answers);

    const nums = values
      .map(Number)
      .filter(Number.isFinite);

    const score = nums.length
      ? Math.round(
          (nums.reduce((a, b) => a + b, 0) / nums.length) * 20
        )
      : 0;

    const level =
      score < 34 ? "Low" :
      score < 67 ? "Moderate" :
      "High";

    const record = await Assessment.create({
      userId,
      answers,
      score,
      level,
      topFactors: [],
      responseCount: values.length
    });

    res.json({
      success: true,
      id: String(record._id),
      score: record.score,
      level: record.level,
      topFactors: record.topFactors,
      responseCount: record.responseCount,
      date: record.date
    });
  } catch (error) {
    console.error("Assessment error:", error);
    res.status(500).json({
      error: "Could not save assessment"
    });
  }
});

// Get assessment history
app.get("/api/history/:userId", async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.userId);

    const records = await Assessment.find({ userId })
      .sort({ date: -1 })
      .lean();

    res.json(records.map(record => ({
      score: record.score,
      level: record.level,
      date: record.date
    })));
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({
      error: "Could not load history"
    });
  }
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found",
    path: req.originalUrl
  });
});

// Connect to MongoDB and start the server
async function start() {
  await mongoose.connect(MONGO_URI);

  console.log("MongoDB connected successfully");

  app.listen(PORT, () => {
    console.log(`StressIQ backend running at http://localhost:${PORT}`);
    console.log(`API test: http://localhost:${PORT}/api/test`);
  });
}

start().catch(error => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});

