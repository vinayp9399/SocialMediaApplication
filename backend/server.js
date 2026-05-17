const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app  = express();
const PORT = process.env.PORT || 5000;

// Whitelist configuration array
const allowedOrigins = [
  "http://localhost:3000", 
  "https://social-media-application-wi9u.vercel.app"
];

// FIXED: Dynamic CORS configuration to allow cross-origin cookies
app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, 
  credentials: true 
}));

app.use(cookieParser());
app.use(express.json());

// Route Registrations
app.use("/auth",        require("./routes/auth"));
app.use("/posts",       require("./routes/posts"));
app.use("/comments",    require("./routes/comments"));
app.use("/votes",       require("./routes/votes"));
app.use("/communities", require("./routes/communities"));
app.use("/users",       require("./routes/users"));

app.get("/", (req, res) => res.json({ message: "Nexus API running ✓" }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));