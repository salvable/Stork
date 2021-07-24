module.exports = (sequelize, DataTypes) => {
    const favorite = sequelize.define('favorite', {
        favoriteId: {
            type: DataTypes.STRING(20),
            allowNull:false,
            primaryKey: true
        },
        favoriteName: {
            type: DataTypes.STRING(50),
            allowNull:false,
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull:false
        },
    });
    favorite.associate = function (models) {
        favorite.belongsTo(models.user,{foreignKey: "userId", onDelete: 'CASCADE'});
    };
    return favorite;
};