import express from 'express';

import { MySQLDataSource } from '../data-source';
import { isLoggedIn } from './middleware';
import { Presets } from '../entity/Presets';
import { Users } from '../entity/Users';

const router = express.Router();

router.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const presetRepository = MySQLDataSource.getRepository(Presets);
    const presets = await presetRepository.find({
      where: {
        presetUserId: req.user.Users_ID,
      },
    });
    if (!presets) {
      return res.status(404).json({ message: '해당 사용자의 프리셋이 존재하지 않습니다.' });
    }
    return res.status(200).json({ presets });
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/budget', isLoggedIn, async (req, res, next) => {
  try {
    if (req.user.hasPreset) {
      return res.status(403).json({ message: '이미 프리셋이 등록되어 있습니다.' });
    }
    const presetRepository = MySQLDataSource.getRepository(Presets);
    const userRepository = MySQLDataSource.getRepository(Users);
    const curUser = await userRepository.findOne({
      where: { Users_ID: req.user.Users_ID },
    });
    const eventTypes = ['wedding', 'birthday', 'babyBirthday', 'funeral'];
    const presets = [];

    for (let i = 0; i < eventTypes.length; i++) {
      const eventType = eventTypes[i];
      const preset = await presetRepository.create({
        presetUserId: req.user.Users_ID,
        type: eventType,
        first: req.body.rank1[eventType],
        second: req.body.rank2[eventType],
        third: req.body.rank3[eventType],
        fourth: req.body.rank4[eventType],
      });

      presets.push(preset);

      if (!preset) {
        return res.status(404).json({ message: `${eventType} 프리셋 등록에 실패했습니다.` });
      }
    }

    await Promise.all(presets.map((preset) => presetRepository.save(preset)));
    //await userRepository.update(req.user.Users_ID, { hasPreset: true });
    if (!curUser) {
      return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
    }
    curUser.hasPreset = true;
    await userRepository.save(curUser);
    return res.status(200).json({ message: '프리셋이 등록되었습니다.' });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
