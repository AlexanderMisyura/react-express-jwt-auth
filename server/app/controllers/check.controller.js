const { getUserFromDB } = require("../services/dbCheck.service");

// Define a function to handle database user checks
exports.checkUser = async (req, res) => {
  try {
    const user = await getUserFromDB(req.body);
    if (!user) {
      return res.status(200).json({
        userExists: false,
      });
    }
    res.status(200).json({
      userExists: true,
    });
  } catch (err) {
    res.status(500).json({ message: `check error: ${err}` });
  }
};
