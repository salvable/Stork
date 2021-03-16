

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('account', {
            account_id: {type: DataTypes.STRING(20), allowNull:false, primaryKey: true},
            user_id: {type: DataTypes.STRING(20), allowNull: false, foreignkey: true},
            money: { type: DataTypes.STRING(10), allowNull: false, },
        },
        { timestamps:false, }); }
