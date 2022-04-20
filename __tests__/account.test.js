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

it('GET /account/:userId 200', async () => {
    const response = await request(app).get(`/account/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('GET /account/:userId 404', async () => {
    const response = await request(app).get(`/account/NotFoundTest!!`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('PUT /user/:userId/account/:accountId/deposit 200', async () => {
    const response = await request(app).put(`/user/${userId}/account/${accountId}/deposit?money=100000`).set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(200)
});

it('PUT /user/:userId/account/:accountId/deposit 400', async () => {
    const response = await request(app).put(`/user/${userId}/account/${accountId}/deposit`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('PUT /user/:userId/account/:accountId/deposit 404', async () => {
    const response = await request(app).put(`/user/${userId}/account/accountNotFoundTest/deposit?money=100000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});


it('PUT /user/:userId/account/:accountId/withdrawal 200', async () => {
    const response = await request(app).put(`/user/${userId}/account/${accountId}/withdrawal?money=100000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('PUT /user/:userId/account/:accountId/withdrawal 400', async () => {
    const response = await request(app).put(`/user/${userId}/account/${accountId}/withdrawal?money=9999999999`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('PUT /user/:userId/account/:accountId/withdrawal 404', async () => {
    const response = await request(app).put(`/user/${userId}/account/accountNotFoundTest/withdrawal?money=100000`).set(
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