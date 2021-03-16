module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        id: {type: DataTypes.STRING(20), allowNull: false, primaryKey: true},
        password: { type: DataTypes.STRING(100), allowNull: false, },
        email: {type: DataTypes.STRING(20), allowNull: false, unique: true,},
        name: { type: DataTypes.STRING(10), allowNull: false, },
        phoneNumber: {type: DataTypes.STRING(20), allowNull: false}
    },
        { timestamps:false, }); }
