module.exports = (sequelize, DataTypes) => {
    // 글번호, 글제목, 글 내용, 글쓴이 (익명가능),비밀번호 ,작성날짜 ,조회수 , 추천수
    const board = sequelize.define('board', {
        boardId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull:false,
        },
        content: {
            type: DataTypes.TEXT(),
            allowNull:false
        },
        writer:{
            type: DataTypes.STRING(20),
            allowNull:false
        },
        password:{
            type: DataTypes.STRING(20),
            allowNull:false
        },
        hit:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        // 추천수
        star:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        unStar:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
    });

    board.associate = function(models){
        board.hasMany(models.comment,{ foreignKey: 'boardId' })
    };
    return board;
};