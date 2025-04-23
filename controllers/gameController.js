const User = require("../models/User");

// Save quiz result
exports.saveQuizResult = async (req, res) => {
  try {
    const { email, category, score, accuracy } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.quizResults.push({ category, score, accuracy });
    await user.save();
    res.status(200).json({ message: "Quiz result saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving quiz result", error: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { category, email } = req.query;
    if (email) {
      // Get individual user's all quiz results
      const user = await User.findOne({ email }).select(
        "email name quizResults"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    }
    if (category) {
      // Get all users' results for a specific category
      const users = await User.aggregate([
        { $unwind: "$quizResults" },
        { $match: { "quizResults.category": category } },
        {
          $project: {
            email: 1,
            name: 1,
            score: "$quizResults.score",
            accuracy: "$quizResults.ac  curacy",
            category: "$quizResults.category",
          },
        },
        { $sort: { score: -1 } },
      ]);
      return res.status(200).json(users);
    }

    // Get all users with all quiz results (general leaderboard)
    const users = await User.find().select("email name quizResults");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leaderboard", error: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;
    // Don't allow updating email or password through this endpoint
    if (updateData.email || updateData.password) {
      return res
        .status(400)
        .json({ message: "Cannot update email or password here" });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
