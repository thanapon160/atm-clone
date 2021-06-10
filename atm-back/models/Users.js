module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }, name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passcode: {
      type: DataTypes.DECIMAL(6),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    },

  },
    {
      underscored: true,
      timestamps: false,
    }
  );
  User.associate = models => {
    User.hasMany(models.Transaction, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  }
  return User
}