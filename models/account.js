module.exports = (sequelize, DataTypes) => {
    const account = sequelize.define('account', {
        account_id: {
            type: DataTypes.STRING(20),
            allowNull:false,
            primaryKey: true
        },
        money: {
            type: DataTypes.STRING(20),
            allowNull:false
        },
        email: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    });
    account.associate = function (models) {
        account.belongsTo(models.user,{foreignKey: "email"});
    };
    return account;
};