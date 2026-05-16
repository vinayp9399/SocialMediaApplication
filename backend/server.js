const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth",        require("./routes/auth"));
app.use("/posts",       require("./routes/posts"));
app.use("/comments",    require("./routes/comments"));
app.use("/votes",       require("./routes/votes"));
app.use("/communities", require("./routes/communities"));
app.use("/users", require("./routes/users"));

app.get("/", (req, res) => res.json({ message: "Nexus API running ✓" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
