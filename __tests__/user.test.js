const request =  require("supertest")
const app = require("../app")


// it('GET / Test', async() => {
//     // 명시한 api 경로를 통해 요청한 후 값을 받아온다.
//     const response = await request(app).get('/')
//     // 응답한 값이 예상한 값과 맞는 지 비교한다.
//     expect(response.statusCode).toBe(200);
//
//     try {
//         await response();
//     } catch (e) {
//         expect(e).toMatch('error');
//     }
// });

it('GET / Test', async () => {
    const response = await request(app).get('/');
        // .send({
        //
        // });

    expect(response.statusCode).toBe(200)
});

it('POST /user', async () => {
    const response = await request(app).post('/user').send({
        userId : "testJest",
        password : "test1234",
        email : "jestTest@naver.com",
        name : "JEST",
        phoneNumber : "010-4548-8451"
    });

    expect(response.statusCode).toBe(200)
});