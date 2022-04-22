const request =  require("supertest")
const app = require("../app")

const userId = "testJest"
const password = "test1234"
const boardPassword = "1q2w3e4r!"
const commentPassword = "avcsdg1212c!"
let boardId = ""
let commentId = ""
let accessToken = ""

it('POST /user 200', async () => {
    const response = await request(app).post('/user').send({

        userId : userId,
        password : password,
        email : "jestTest@naver.com",
        name : "JEST",
        phoneNumber : "010-4548-8451"
    });

    expect(response.statusCode).toBe(200)
});


it('POST /Login 200', async () => {
    const response = await request(app).post(`/Login`).send({
        userId : userId,
        password : password
    });

    accessToken = JSON.parse(response.res.text).token
    expect(response.statusCode).toBe(200)
});

it('POST /board 200', async () => {
    const response = await request(app).post('/board').send({
       name: "게시판 테스트",
       content: "게시판 테스트 입니다~",
       writer: userId,
       password: boardPassword
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    boardId = JSON.parse(response.res.text).board.boardId

    expect(response.statusCode).toBe(200)
});

it('POST /board 400', async () => {
    const response = await request(app).post('/board').send({
        writer: userId,
        password: boardPassword
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('PUT /board/:boardId 200', async () => {
    const response = await request(app).put(`/board/${boardId}`).send({
        name: "게시판 업데이트 테스트!!!!!",
        content: "게시판 업데이트를 테스트해봅니다.",
        password: boardPassword
    });

    expect(response.statusCode).toBe(200)
});

it('PUT /board/:boardId 400', async () => {
    const response = await request(app).put(`/board/${boardId}`).send({
        password: boardPassword
    });

    expect(response.statusCode).toBe(400)
});

it('PUT /board/:boardId 403', async () => {
    const response = await request(app).put(`/board/${boardId}`).send({
        name: "게시판 업데이트 테스트!!!!!",
        content: "게시판 업데이트를 테스트해봅니다.",
        password: "Fobbiden Test"
    });

    expect(response.statusCode).toBe(403)
});

it('GET /boards 200', async () => {
    const response = await request(app).get(`/boards?page=1`)

    expect(response.statusCode).toBe(200)
});

it('GET /boards 400', async () => {
    const response = await request(app).get(`/boards?page=0`)

    expect(response.statusCode).toBe(400)
});

it('GET /boards 2 400', async () => {
    const response = await request(app).get(`/boards`)

    expect(response.statusCode).toBe(400)
});

it('GET /board/:boardId 200', async () => {
    const response = await request(app).get(`/board/${boardId}`)

    expect(response.statusCode).toBe(200)
});

it('GET /board/:boardId 404', async () => {
    const response = await request(app).get(`/board/999999`)

    expect(response.statusCode).toBe(404)
});

it('PUT /board/:boardId/star 200', async () => {
    const response = await request(app).put(`/board/${boardId}/star`).send({
        userId: userId,
        type: "star"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('PUT /board/:boardId/star 404', async () => {
    const response = await request(app).put(`/board/999999/star`).send({
        userId: userId,
        type: "unstar"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('PUT /board/:boardId/star 409', async () => {
    const response = await request(app).put(`/board/${boardId}/star`).send({
        userId: userId,
        type: "unstar"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(409)
});

it('GET /board/:boardId/checkPw 200', async () => {
    const response = await request(app).get(`/board/${boardId}/checkPw?password=${boardPassword}`)

    expect(response.statusCode).toBe(200)
});

it('GET /board/:boardId/checkPw 400', async () => {
    const response = await request(app).get(`/board/${boardId}/checkPw?password=passwordTest`)

    expect(response.statusCode).toBe(400)
});

it('POST /board/:boardId/comment 200', async () => {
    const response = await request(app).post(`/board/${boardId}/comment`).send({
        userId : userId,
        password : commentPassword,
        content : "댓글테스트입니다~"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    commentId = JSON.parse(response.res.text).comment.commentId

    expect(response.statusCode).toBe(200)
});

it('POST /board/:boardId/comment 400', async () => {
    const response = await request(app).post(`/board/${boardId}/comment`).send({
        content : "댓글테스트입니다~"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('POST /board/:boardId/comment 404', async () => {
    const response = await request(app).post(`/board/NotFoundTest/comment`).send({
        userId : userId,
        password : commentPassword,
        content : "댓글테스트입니다~"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('GET /board/:boardId/comment 200', async () => {
    const response = await request(app).get(`/board/${boardId}/comment`)

    expect(response.statusCode).toBe(200)
});

it('GET /board/:boardId/comment 404', async () => {
    const response = await request(app).get(`/board/NotFoundTest/comment`)

    expect(response.statusCode).toBe(404)
});

it('DELETE /board/:boardId/comment/:commentId 403' , async () => {
    const response = await request(app).delete(`/board/${boardId}/comment/${commentId}?password=Notequelpassword`)

    expect(response.statusCode).toBe(403)
});

it('DELETE /board/:boardId/comment/:commentId 404' , async () => {
    const response = await request(app).delete(`/board/${boardId}/comment/notfound?password=${commentPassword}`)

    expect(response.statusCode).toBe(404)
});

it('DELETE /board/:boardId/comment/:commentId 200' , async () => {
    const response = await request(app).delete(`/board/${boardId}/comment/${commentId}?password=${commentPassword}`)

    expect(response.statusCode).toBe(200)
});

it('DELETE /board/:boardId 400' , async () => {
    const response = await request(app).delete(`/board/${boardId}?`)

    expect(response.statusCode).toBe(400)
});

it('DELETE /board/:boardId 2 400' , async () => {
    const response = await request(app).delete(`/board/${boardId}?password=passwordTest`)

    expect(response.statusCode).toBe(400)
});

it('DELETE /board/:boardId' , async () => {
    const response = await request(app).delete(`/board/${boardId}?password=${boardPassword}`)

    expect(response.statusCode).toBe(200)
});

it('DELETE /user/:userId 200' , async () => {
    const response = await request(app).delete(`/user/${userId}?password=${password}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(200)
});
