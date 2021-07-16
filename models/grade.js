module.exports = (sequelize, DataTypes) => {
    const grade = sequelize.define('grade', {
        userId: {
            type: DataTypes.STRING(20),
            allowNull:false,
            primaryKey: true
        },
        grade: {
            type: DataTypes.STRING(20),
            allowNull:false
        }
    });
    grade.associate = function (models) {
        grade.belongsTo(models.user,{foreignKey: "userId", onDelete: 'cascade'});
    };
    return grade;
};