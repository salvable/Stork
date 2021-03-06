module.exports = (sequelize, DataTypes) => {
    const account = sequelize.define('account', {
        accountId: {
            type: DataTypes.STRING(20),
            allowNull:false,
            primaryKey: true
        },
        money: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull:false,
        },
    });
    account.associate = function (models) {
        account.belongsTo(models.user,{foreignKey: "userId", onDelete: 'CASCADE'});
    };
    return account;
};