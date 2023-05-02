module.exports = (sequelize, Sequelize) => {
  // Define the Token model
  const RevokedRefreshToken = sequelize.define(
    "RevokedRefreshToken",
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // name of the User table
          key: "id", // field in the User table
        },
      },
      jti: {
        type: Sequelize.UUID,
        unique: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "revoked_refresh_tokens",
    }
  );

  // Define the association with the User model
  RevokedRefreshToken.associate = (models) => {
    RevokedRefreshToken.belongsTo(models.User, {
      onDelete: "CASCADE", // delete the token when the user is deleted
      foreignKey: "user_id", // use user_id as the foreign key
      targetKey: "id", // match with the id field in the User table
    });
  };

  // Return the Token model
  return RevokedRefreshToken;
};
