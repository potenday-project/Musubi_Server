import passport from 'passport';
import { Users } from '../entity/Users';
import local from './local';
import { DataSource } from 'typeorm';
import { MySQLDataSource } from '../data-source';
import { Events } from '../entity/Events';
import { Friends } from '../entity/Friends';
import { Presets } from '../entity/Presets';

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser<number>(async (user, done) => {
    try {
      const userRepository = MySQLDataSource.getRepository(Users);
      // const user = await userRepository.findOne({
      //   where: { Users_ID:  },
      // });


      if (!user) {
        return done(new Error('no user'));
      }
      return done(null, user); // req.user
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  local();
};
