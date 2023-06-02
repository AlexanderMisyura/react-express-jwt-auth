exports.provideUserAccess = (req, res) => {
  res
    .status(200)
    .json({ message: "access provided", data: "some protected user data" });
};

exports.provideAdminAccess = (req, res) => {
  res
    .status(200)
    .json({ message: "access provided", data: "some protected Admin data" });
};
