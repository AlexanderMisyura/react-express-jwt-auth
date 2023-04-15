const { User } = require("../models");

async function getUserFromDB(query) {
  try {
    const user = User.findOne({
      where: query,
    });

    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Database error");
  }
}

module.exports = {
  getUserFromDB,
};
