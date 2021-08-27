module.exports = (sequelize, DataTypes) => {
    const star = sequelize.define('star', {
        starId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true
        },
        starType: {
            type: DataTypes.STRING(50),
            allowNull:false,
        },
    });

    return star;

};