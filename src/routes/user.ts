import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { MySQLDataSource } from '../data-source';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import { Users } from '../entity/Users';
import { Events } from '../entity/Events';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  const user = req.user!.toJSON() as Users;
  // user?.password && delete user.password;
  return res.json(user);
});

router.post('/signup', async (req, res, next) => {
  try {
    const userRepository = MySQLDataSource.getRepository(Users);
    const exUser = await userRepository.findOne({ where: { userId: req.body.userId } });
    if (exUser) {
      return res.status(403).json({message: "이미 사용 중인 아이디입니다."});
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await userRepository.create({
      email: req.body.email,
      userId: req.body.userId,
      name: req.body.name,
      password: hashedPassword,
    });
    await userRepository.save(newUser);
    return res.status(200).json({ message: '신규 유저가 등록되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.post('/login', async (req, res, next) => {
//   try {
//     const userRepository = MySQLDataSource.getRepository(Users);
//     const eventRepository = MySQLDataSource.getRepository(Events);

//     const User = await userRepository.findOneBy({ userId: req.body.userId });
//     if (!User) {
//       return res.status(403).send('존재하지 않는 사용자입니다.');
//     }
//     const result = await bcrypt.compare(req.body.password, User.password);
//     if (!result) {
//       return res.status(403).send('비밀번호가 틀립니다.');
//     }
//     const UserSecure = await userRepository.findOne({
//       where: { userId: req.body.userId },
//       select: ['userId', 'email', 'name'],
//     });
//     const UserEvents = await eventRepository.find({
//       where: { eventUserId: UserSecure! },
//     });
//     const fullUser = {
//       ...UserSecure,
//       events: UserEvents,
//     };
//     return res.json(fullUser);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err: Error, user: Users, info: { message: string }) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.message);
    }
    return req.login(user, async (loginErr: Error) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const userRepository = MySQLDataSource.getRepository(Users);
        //const eventRepository = MySQLDataSource.getRepository(Events);

        const UserSecure = await userRepository.findOne({
          select: ['userId', 'email', 'name'],
          where: { Users_ID: user.Users_ID },
        });
        // const UserEvents = await eventRepository.find({
        //   where: { userId: UserSecure! },
        // });
        // const fullUser = {
        //   ...UserSecure,
        //   events: UserEvents,
        // };
        return res.json(UserSecure);
      } catch (e) {
        console.error(e);
        return next(e);
      }
    });
  })(req, res, next);
});
export default router;
