import express from 'express';
import { MySQLDataSource } from '../data-source';
import { isLoggedIn } from './middleware';
import { Events } from '../entity/Events';
import { Friends } from '../entity/Friends';
import { Users } from '../entity/Users';
import { Presets } from '../entity/Presets';
import { EventType } from '../entity/common/Enums';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/ko';

dayjs.extend(isLeapYear);
dayjs.locale('ko');

const router = express.Router();

//사용자의 모든 일정을 가져오는 API
router.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const eventRepository = MySQLDataSource.getRepository(Events);
    const presetRepository = MySQLDataSource.getRepository(Presets);
    console.log(req.user);

    const events:any = await eventRepository.find({
      where: {
        eventUserId: req.user.Users_ID,
      },
      relations: ['friendId'],
    });

    if (!events) {
      return res.status(404).json({ message: '해당 사용자의 일정이 존재하지 않습니다.' });
    }
    const eventPrice = await presetRepository.findOne({
      where: { presetUserId: req.user.Users_ID, type: req.body.eventType  },
    })
    if (!eventPrice) {
      return res.status(500).json({ message: '해당 사용자의 프리셋을 DB에서 찾을 수 없습니다.'})
    }

    const responseDTO = events.map((event: { title: string; eventTime: Date; friendId: { rank: number; }; eventType: string; friendName: string; memo: string; }) => {
      let price = 0;
      switch (event.friendId.rank) {
        case 1:
          price = eventPrice.first;
          break;
        case 2:
          price = eventPrice.second;
          break;
        case 3:
          price = eventPrice.third;
          break;
        case 4:
          price = eventPrice.fourth;
          break;
        default:
          price = 0;
          break
      }
      return {
        title: event.title,
        start: event.eventTime,
        end: event.eventTime,
        resource: {
          rank: event.friendId.rank,
          type: event.eventType,
          friendName: event.friendName,
          memo: event.memo,
          price: price,
        },
      };
    });
    return res.status(200).json(responseDTO);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/new', isLoggedIn, async (req, res, next) => {
  try {
    const eventRepository = MySQLDataSource.getRepository(Events);
    const friendRepository = MySQLDataSource.getRepository(Friends);
    const userRepository = MySQLDataSource.getRepository(Users);
    const presetRepository = MySQLDataSource.getRepository(Presets);
    const curUser = await userRepository.findOne({
      where: { Users_ID: req.user.Users_ID },
    });
    const eventFriend = await friendRepository.findOne({
      where: { name: req.body.friendName, friendUserId: req.user.Users_ID },
    });
    if (!(curUser!.hasPreset)) {
      return res.status(403).json({message: '프리셋을 먼저 등록해주세요!'});
    }
    if (!eventFriend) {
      return res.status(404).json({message: '등록된 친구가 존재하지 않습니다.'});
    }
    const eventPreset = await presetRepository.findOne({
      where: { presetUserId: req.user.Users_ID, type: req.body.eventType  },
    });
    if (!eventPreset) {
      return res.status(404).json({message: '해당 사용자의 프리셋이 존재하지 않습니다.'});
    }
    eventFriend.rank = req.body.rank;
    await friendRepository.save(eventFriend);
    
    const newEvent = await eventRepository.create({
      eventUserId: req.user.Users_ID,
      friendId: eventFriend.Friend_ID,
      presetId: eventPreset.Preset_ID,
      friendName: req.body.friendName,
      eventType: EventType[req.body.eventType],
      title: req.body.title,
      memo: req.body.memo,
      eventTime: dayjs(req.body.eventTime).toDate(),
    });
    if (!newEvent) {
      return res.status(404).json({ message: '일정 생성에 실패했습니다.' });
    }
    await eventRepository.save(newEvent);
    return res.status(200).json({ message: '신규 일정이 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});
export default router;
