const bcryptjs = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
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
      tableName: "users",
      hooks: {
        // hook to hash the password before saving it to the database
        beforeCreate: async (user) => {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        },
      },
    }
  );

  // Define the association with the Role model
  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: "user_roles",
      foreignKey: "userId",
      otherKey: "roleId",
    });
  };

  // method to compare passwords
  User.prototype.comparePassword = async function (password) {
    try {
      const isMatch = await bcryptjs.compare(password, this.password);
      return isMatch;
    } catch (err) {
      throw new Error(err);
    }
  };

  return User;
};
