import express from 'express';
import passport from 'passport';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import { MySQLDataSource } from '../data-source';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import { Users } from '../entity/Users';
import { Events } from '../entity/Events';

const router = express.Router();

router.get('/', isLoggedIn, (req, res, next) => {
  try {
    console.log(req.user)
    res.send('hi')
  } catch(e) {
    console.error(e);
  }
})

router.get('/:id',async (req, res, next) => {
    try {
        const paramsId = req.params.id;
        const userRepository = MySQLDataSource.getRepository(Users);
        const user = await userRepository.findOne({
            where: {
                userId: paramsId
            },
            relations: ["Events"]
        });

        if (!user) {
            return res.status(404).json({ message: "해당 사용자가 존재하지 않습니다."});
        }

        // const events = user.Events;
        // return res.status(200).json(events);

    } catch (err) {
        console.error(err);
        return next(err);
    }
})

// router.post('/', async (req, res, next) => {
//   try {
//     const eventRepository = MySQLDataSource.getRepository(Events);
//     const newEvent = await eventRepository.create({
//         eventUserId: req.body.userId,
//         eventTitle: req.body.eventTitle,
//         eventContent: req.body.eventContent,
//         friendId: req.body.friendId,

//     })
//     res.send("hi")
//   } catch (err) {
//     console.error(err);
//     return next(err);
//   }
// });
export default router;