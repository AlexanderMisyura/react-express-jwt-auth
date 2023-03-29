module.exports = (sequelize, Sequelize) => {
  // Define the Token model
  const RefreshToken = sequelize.define("refresh_token", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users", // name of the User table
        key: "id", // field in the User table
      },
    },
    jti: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  // Define the association with the User model
  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.user, {
      onDelete: "CASCADE", // delete the token when the user is deleted
      foreignKey: "user_id", // use user_id as the foreign key
      targetKey: "id", // match with the id field in the User table
    });
  };

  // Return the Token model
  return RefreshToken;
};
