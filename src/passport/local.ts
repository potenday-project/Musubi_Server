import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { Users } from '../entity/Users';
import { MySQLDataSource } from '../data-source';

export default () => {
  passport.use(
    'local',
    new Strategy(
      {
        usernameField: 'userId',
        passwordField: 'password',
      },
      async (userId, password, done) => {
        try {
          const userRepository = MySQLDataSource.getRepository(Users);
          const user = await userRepository.findOneBy({ userId: userId });
          if (!user) {
            return done(null, false, { message: '존재하지 않는 사용자입니다!' });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { message: '비밀번호가 틀립니다.' });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
