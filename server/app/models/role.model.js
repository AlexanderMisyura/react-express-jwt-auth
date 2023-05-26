module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      role_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "roles",
    }
  );

  // Define the association with the User model
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: "user_roles",
      foreignKey: "roleId",
      otherKey: "userId",
    });
  };

  return Role;
};
