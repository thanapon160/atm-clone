module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    type: {
      type: DataTypes.ENUM,
      values: ['DEPOSIT', 'WITHDRAWAL'],
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
    }
  },
    {
      underscored: true,
      timestamps: true,
    }
  );
  Transaction.associate = models => {
    Transaction.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  }
  return Transaction
}