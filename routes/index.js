// routes/index.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const gameController = require("../controllers/gameController");
const authMiddleware = require("../middlewares/auth");
const authRoutes = require("./auth");

router.use("/auth", authRoutes);

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);

// User routes
router.put("/user", authMiddleware, userController.updateUser);

// Game routes
router.get("/leaderboard", gameController.getLeaderboard);
router.post("/quiz-result", authMiddleware, gameController.saveQuizResult);

module.exports = router;