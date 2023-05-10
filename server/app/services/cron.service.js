const cron = require("node-cron");
const { deleteExpiredTokens } = require("./token.service");

// A cron job that deletes expired tokens from the database at 00:00 every day
const deleteTokensTask = cron.schedule("0 0 * * * *", deleteExpiredTokens);

module.exports = { deleteTokensTask };
