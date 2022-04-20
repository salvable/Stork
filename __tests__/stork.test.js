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

// 임시로 storkName, number, price를 설정, 원래는 Django서버로부터 크롤링한 값을 가져옴
it('POST /stork/purchase/:userId/:accountId 200', async () => {
    const response = await request(app).post(`/stork/purchase/${userId}/${accountId}?storkName="${encodeURI("삼성전자")}"&number=5&price=70000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );;

    expect(response.statusCode).toBe(200)
});

it('POST /stork/purchase/:userId/:accountId 404', async () => {
    const response = await request(app).post(`/stork/purchase/${userId}/${accountId}?storkName="${encodeURI("삼성전자")}"&number=500&price=70000`).set(
        'Authorization' ,  `Bearer ${accessToken}`
    );;


    expect(response.statusCode).toBe(400)
});



it('DELETE /user/:userId 200' , async () => {
    const response = await request(app).delete(`/user/${userId}`)
        .set(
            'Authorization' ,  `Bearer ${accessToken}`
        );

    expect(response.statusCode).toBe(200)
});

