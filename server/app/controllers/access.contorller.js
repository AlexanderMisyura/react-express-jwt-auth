exports.provideAccess = (req, res) => {
  res
    .status(200)
    .json({ message: "access provided", data: "some protected data" });
};
