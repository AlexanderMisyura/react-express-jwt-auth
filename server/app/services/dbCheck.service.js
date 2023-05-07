const { User } = require("../models");
const { DatabaseError } = require("../utils/errorClasses");

async function getUserFromDB(query) {
  try {
    const user = User.findOne({
      where: query,
    });

    return user;
  } catch (err) {
    throw new DatabaseError(err.message, err);
  }
}

module.exports = {
  getUserFromDB,
};
