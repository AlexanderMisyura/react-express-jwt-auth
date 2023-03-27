const bcryptjs = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        // hook to hash the password before saving it to the database
        beforeCreate: async (user) => {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        },
      },
      instanceMethods: {
        // method to compare passwords
        comparePassword: async function (password, callback) {
          try {
            const isMatch = await bcryptjs.compare(password, this.password);
            callback(null, isMatch);
          } catch (err) {
            callback(err);
          }
        },
      },
    }
  );

  return User;
};
