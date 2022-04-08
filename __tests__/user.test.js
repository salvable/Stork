const request =  require("supertest")
const app = require("../app")

const userId = "testJest"
const password = "test1234"
let accessToken = ""

//DB초기화 문제 정상적으로 작동
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

it('POST /user 400', async () => {
    const response = await request(app).post('/user').send({
        email : "jestTest@naver.com",
        name : "JEST",
        phoneNumber : "010-4548-8451"
    });

    expect(response.statusCode).toBe(400)
});

it('POST /user 409', async () => {
    const response = await request(app).post('/user').send({
        userId : userId,
        password : password,
        email : "jestTest@naver.com",
        name : "JEST",
        phoneNumber : "010-4548-8451"
    });

    expect(response.statusCode).toBe(409)
});

it('GET /Login 200', async () => {
    const response = await request(app).post(`/Login`).send({
        userId : userId,
        password : password
    });

    accessToken = JSON.parse(response.res.text).token
    expect(response.statusCode).toBe(200)
});

it('GET /user/:userId 200', async () => {
    const response = await request(app).get(`/user/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('GET /user/:userId 404', async () => {
    const response = await request(app).get(`/user/NotFoundTest`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('PUT /user 200', async () => {
    const response = await request(app).put(`/user/${userId}`)
        .send({
            password : password,
            email : "modifyTest@naver.com",
            name : "Modify Test",
            phoneNumber : "010-3333-1111"
        }).set(
            'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('PUT /user 400', async () => {
    const response = await request(app).put(`/user/${userId}`)
        .send({
            phoneNumber : "010-3333-1111"
        }).set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(400)
});

it('PUT /user 404', async () => {
    const response = await request(app).put(`/user/NotFoundTest`)
        .send({
            password : password,
            email : "modifyTest@naver.com",
            name : "Modify Test",
            phoneNumber : "010-3333-1111"
        }).set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(404)
});

it('GET /verification/:userId 200' , async () => {
    const response = await request(app).get(`/verification/${userId}?password=${password}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(200)
});

it('GET /verification/:userId 400' , async () => {
    const response = await request(app).get(`/verification/${userId}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(400)
});

it('GET /verification/:userId 404' , async () => {
    const response = await request(app).get(`/verification/NotFoundTest?password=${password}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(404)
});

it('DELETE /user/:userId 200' , async () => {
    const response = await request(app).delete(`/user/${userId}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(200)
});