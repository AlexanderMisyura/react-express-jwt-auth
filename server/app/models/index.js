const config = require("../config/db.config");

const Sequelize = require("sequelize");

// Create a sequelize instance with the database configuration
const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: config.dialect,
  }
);

// Test the connection to the database
sequelize
  .authenticate()
  .then(() =>
    console.log("Connection to database has been established successfully.")
  )
  .catch((err) => console.log("Unable to connect to the database:", err));

// Import all models from the models folder
const fs = require("fs");
const path = require("path");
const db = {};

fs.readdirSync(path.join(__dirname, "."))
  .filter((file) => file.slice(-8) === "model.js") // filter only files that end with "model.js"
  .forEach((file) => {
    // import the model function from each file
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    // save the model to the db object with its name as the key
    db[model.name] = model;
  });

// Call the associate method for each model
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    // pass the db object to create associations between models
    db[modelName].associate(db);
  }
});

// Export all models and the sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
