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

it('DELETE /user/:userId 200' , async () => {
    const response = await request(app).delete(`/user/${userId}?password=${password}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(200)
});