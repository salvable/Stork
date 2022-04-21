const request =  require("supertest")
const app = require("../app")

const userId = "testJest"
const password = "test1234"
let accessToken = ""
let accountId = ""

it('POST /user 200', async () => {
    const response = await request(app).post('/user').send({

        userId : userId,
        password : password,
        email : "jestTest@naver.com",
        name : "JEST",
        phoneNumber : "010-4548-8451"
    });

    accountId = JSON.parse(response.res.text).account.accountId

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

// faviriteId는 각각 주가 코드와 코인마켓이름 testcase는 삼성전자로 작성
it('POST /favorite/:userId 200', async () => {
    const response = await request(app).post(`/favorite/${userId}`).send({
        favoriteId: "005930",
        favoriteName: "삼성전자",
        type: "stork"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('POST /favorite/:userId 400', async () => {
    const response = await request(app).post(`/favorite/${userId}`).send({
        favoriteName: "삼성전자",
        type: "stork"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('POST /favorite/:userId 409', async () => {
    const response = await request(app).post(`/favorite/${userId}`).send({
        favoriteId: "005930",
        favoriteName: "삼성전자",
        type: "stork"
    }).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(409)
});

it('GET /favorite/:userId 200', async () => {
    const response = await request(app).get(`/favorite/${userId}?favoriteId=005930`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('GET /favorite/:userId 400', async () => {
    const response = await request(app).get(`/favorite/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('GET /favorite/:userId 404', async () => {
    const response = await request(app).get(`/favorite/${userId}?favoriteId=123123456`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('GET /favorites/:userId 200', async () => {
    const response = await request(app).get(`/favorites/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('GET /favorites/:userId 404', async () => {
    const response = await request(app).get(`/favorites/45653434`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('GET /favorites/favoriteList/:userId 200', async () => {
    const response = await request(app).get(`/favorites/favoriteList/${userId}?search=${encodeURI("전자")}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});


it('DELETE /favorite/:userId 200', async () => {
    const response = await request(app).delete(`/favorite/${userId}?favoriteId=005930`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('DELETE /favorite/:userId 400', async () => {
    const response = await request(app).delete(`/favorite/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('DELETE /favorite/:userId 404', async () => {
    const response = await request(app).delete(`/favorite/${userId}?favoriteId=005930`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('DELETE /user/:userId 200' , async () => {
    const response = await request(app).delete(`/user/${userId}?password=${password}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(200)
});