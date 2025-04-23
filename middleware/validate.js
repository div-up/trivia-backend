exports.validatePassword = (req, res, next) => {
    const { newPassword } = req.body;
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    next();
  };