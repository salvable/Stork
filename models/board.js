module.exports = (sequelize, DataTypes) => {
    // 글번호, 글제목, 글 내용, 글쓴이 (익명가능),비밀번호 ,작성날짜 ,조회수 , 추천수
    const board = sequelize.define('board', {
        boardId: {
            type: DataTypes.STRING(20),
            allowNull:false,
            primaryKey: true
        },
        boardName: {
            type: DataTypes.STRING(50),
            allowNull:false,
        },
        boardContent: {
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
        writer:{
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

    });


    return board;
};