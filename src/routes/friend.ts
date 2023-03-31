import express from 'express';
import passport from 'passport';

import { MySQLDataSource } from '../data-source';
import { isLoggedIn } from './middleware';

import { Friends } from '../entity/Friends';

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const friendRepository = MySQLDataSource.getRepository(Friends);
    console.log(req.user);
    const friends = await friendRepository.find({
      where: {
        friendUserId: req.user.Users_ID,
      },
    });
    if (!friends) {
      return res.status(404).json({ message: '해당 사용자의 친구들이 존재하지 않습니다.' });
    }
    return res.status(200).json({ friends });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/new', isLoggedIn, async (req, res, next) => {
  try {
    const friendRepository = MySQLDataSource.getRepository(Friends);
    const exFriend = await friendRepository.findOne({
      where: { name: req.body.name, friendUserId: req.user.Users_ID },
    });
    if (exFriend) {
      return res.status(404).json({ message: '같은 이름이 존재합니다. 다른 이름이나 닉네임을 입력해주세요!' });
    }
    const newFriend = await friendRepository.create({
      friendUserId: req.user.Users_ID,

      name: req.body.name,
      rank: req.body.rank,
    });
    if (!newFriend) {
      return res.status(404).json({ message: '친구 등록에 실패했습니다.' });
    }
    await friendRepository.save(newFriend);
    return res.status(200).json({ message: '친구가 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.delete('/:id/:friendName', isLoggedIn, async (req, res, next) => {
  try {
    const friendRepository = MySQLDataSource.getRepository(Friends);
    const friend = await friendRepository.findOne({
      where: { friendUserId: req.user.Users_ID, name: req.params.friendName },
    });
    if (!friend) {
      return res.status(404).json({ message: '해당 친구가 존재하지 않습니다.' });
    }
    if (friend.name !== req.params.friendName) {
      return res.status(404).json({ message: '친구 이름을 잘못 요청하셨습니다.' });
    }
    await friendRepository.delete(friend);
    return res.status(200).json({ message: '친구가 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
