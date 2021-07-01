module.exports = (sequelize, DataTypes) => {
    const user =  sequelize.define('user', {
        userId: {type: DataTypes.STRING(20), allowNull: false, primaryKey: true},
        password: { type: DataTypes.STRING(100), allowNull: false, },
        email: {type: DataTypes.STRING(20), allowNull: false,},
        name: { type: DataTypes.STRING(30), allowNull: false, },
        phoneNumber: {type: DataTypes.STRING(20), allowNull: false}
    }, { timestamps:false, });

    user.associate = function(models){
        user.hasOne(models.account,{ foreignKey: 'userId' })
    };

    user.associate = function(models){
        user.hasOne(models.grade,{ foreignKey: 'userId' })
    };

    user.associate = function(models){
        user.hasMany(models.stork,{ foreignKey: 'userId' })
    };

    user.associate = function(models){
        user.hasMany(models.favorite,{ foreignKey: 'userId' })
    };
    return user
}
