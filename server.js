const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

connectDB();

const app = express();

const allowedOrigins = ["http://localhost:5173","https://triviaquizwhiz.netlify.app"]

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
// Routes
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const gameRoutes = require("./routes/game-route");
app.use("/api/game", gameRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );
