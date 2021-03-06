const request =  require("supertest")
const app = require("../app")

const userId = "testJest"
const password = "test1234"
let accessToken = ""
let accountId = ""
const storkId = Math.floor(Math.random() * 9999999);


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

// 임시로 storkName, number, price를 설정, 원래는 Django서버로부터 크롤링한 값을 가져옴
it('POST /stork/purchase/:userId/:accountId 200', async () => {
    const response = await request(app).post(`/stork/purchase/${userId}/${accountId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    ).send({
        storkId: storkId,
        storkName: "삼성전자",
        number: 14,
        price: 70000
    });

    expect(response.statusCode).toBe(200)
});

it('POST /stork/purchase/:userId/:accountId 400', async () => {
    const response = await request(app).post(`/stork/purchase/${userId}/${accountId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    ).send({
        storkId: "124214214",
        storkName: "삼성전자",
        number: 500,
        price: 70000
    });

    expect(response.statusCode).toBe(400)
});


it('POST /stork/purchase/:userId/:accountId 400', async () => {
    const response = await request(app).post(`/stork/purchase/${userId}/${accountId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    ).send({
        storkId: "43523454235324",
        storkName: "삼성전자"
    });

    expect(response.statusCode).toBe(400)
});

it('POST /stork/purchase/:userId/:accountId 2 404', async () => {
    const response = await request(app).post(`/stork/purchase/${userId}/NotFoundTest`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    ).send({
        storkId: "45654625423423",
        storkName: "삼성전자",
        number: 500,
        price: 70000
    });

    expect(response.statusCode).toBe(404)
});

it('POST /stork/sale/:userId/:accountId 200', async () => {
    const response = await request(app).post(`/stork/sale/${userId}/${accountId}?storkName=${encodeURI("삼성전자")}&number=10&price=70000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('POST /stork/sale/:userId/:accountId 400', async () => {
    const response = await request(app).post(`/stork/sale/${userId}/${accountId}?storkName=${encodeURI("삼성전자")}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('POST /stork/sale/:userId/:accountId 2 400', async () => {
    const response = await request(app).post(`/stork/sale/${userId}/${accountId}?storkName=${encodeURI("삼성전자")}&number=500&price=70000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(400)
});

it('POST /stork/sale/:userId/:accountId 404', async () => {
    const response = await request(app).post(`/stork/sale/${userId}/Account?storkName=${encodeURI("삼성전자")}&number=5&price=70000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('POST /stork/sale/:userId/:accountId 2 404', async () => {
    const response = await request(app).post(`/stork/sale/${userId}/${accountId}?storkName=NoStork&number=5&price=70000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('GET /stork/:storkName/:userId 200', async () => {
    const response = await request(app).get(`/stork/${encodeURI("삼성전자")}/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('GET /stork/:storkName/:userId 404', async () => {
    const response = await request(app).get(`/stork/${encodeURI("샘송전자")}/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(404)
});

it('GET /storks/:userId 200', async () => {
    const response = await request(app).get(`/storks/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('GET /storks/:userId 200', async () => {
    const response = await request(app).get(`/storks/${userId}`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );

    expect(response.statusCode).toBe(200)
});

it('GET /storks/:userId 404', async () => {
    const response = await request(app).get(`/storks/NotFoundCheck`).set(
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