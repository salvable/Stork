module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
        commentId: {
            type: DataTypes.STRING(20),
            allowNull:false,
            primaryKey: true
        },
        // 비로그인도 가능하기 때문에 user 모델과는 관계없음
        userId: {
            type: DataTypes.STRING(50),
            allowNull:false,
        },
        content: {
            type: DataTypes.TEXT(),
            allowNull:false
        },
        password: {
            type: DataTypes.STRING(20),
            allowNull:false
        },

    });

    comment.associate = function (models) {
        comment.belongsTo(models.board,{foreignKey: "boardId", onDelete: 'CASCADE'});
    };

    return comment;

};