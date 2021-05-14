module.exports = (sequelize, DataTypes) => {
    const stork = sequelize.define('stork', {
        storkName: {
            type: DataTypes.STRING(50),
            allowNull:false,
            primaryKey: true
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