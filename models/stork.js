module.exports = (sequelize, DataTypes) => {
    const stork = sequelize.define('stork', {
        storkId: {
            type: DataTypes.STRING(20),
            allowNull:false,
            primaryKey: true
        },
        storkName: {
            type: DataTypes.STRING(50),
            allowNull:false
        },
        storkCount: {
            type: DataTypes.STRING(20),
            allowNull:false
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull:false
        },


    });
    stork.associate = function (models) {
        stork.belongsTo(models.user,{foreignKey: "userId"});
    };
    return stork;
};