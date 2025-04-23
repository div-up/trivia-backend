const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const auth = require("../middleware/auth");

router.post("/save-result", auth?.protect, gameController.saveQuizResult);
router.get("/leaderboard", gameController.getLeaderboard);
router.patch("/update-user/:email", auth?.protect, gameController.updateUser);

module.exports = router;

