const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models')
const User = db["user"]

const passportConfig = { usernameField: 'userId', passwordField: 'password' };

const passportVerify = async (userId, password, done) => {
    try {
        // 유저 아이디로 일치하는 유저 데이터 검색
        const user = await User.findOne({ where: { userId: userId } });
        // 검색된 유저 데이터가 없다면 에러 표시
        if (!user) {
            done(null, false, { reason: '존재하지 않는 사용자 입니다.' });
            return;
        }
        // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
        const compareResult = await bcrypt.compare(password, user.password);

        // 해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
        if (compareResult) {
            done(null, user);
            return;
        }
        // 비밀번호가 다를경우 에러 표시
        done(null, false, { reason: '올바르지 않은 비밀번호 입니다.' });
    } catch (error) {
        console.error(error);
        done(error);
    }
};

module.exports = () => {
    passport.use('local', new LocalStrategy(passportConfig, passportVerify));
};
