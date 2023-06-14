exports.provideUserAccess = (req, res) => {
  res.status(200).json({
    message: "access provided",
    securedData: "some protected user data",
  });
};

exports.provideAdminAccess = (req, res) => {
  res.status(200).json({
    message: "access provided",
    securedData: "some protected Admin data",
  });
};
