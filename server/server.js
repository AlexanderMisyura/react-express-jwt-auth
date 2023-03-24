const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", (req, res) => {
  res.json({ hello: "hi" });
});

app.listen(8000, () => console.log("api is running on localhost, port 8000"));
