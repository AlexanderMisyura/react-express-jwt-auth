exports.allAccess = (req, res) => {
  res.status(200).json({ message: "available to everyone" });
};

exports.loggedInAccess = (req, res) => {
  res.status(200).json({ message: "logged in users only" });
};
