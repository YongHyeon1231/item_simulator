import express from 'express';
import { prisma } from '../lib/utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import characterValidatorJoiMiddleware from '../middlewares/validators/characterValidator.middleware.js';
import userValidatorJoiMiddleware from '../middlewares/validators/userValidator.middleware.js';
import authMiddleWare from '../middlewares/auths/user-auth.middleware.js';

const router = express.Router();

// 캐릭터 생성
router.post(
  '/characters',
  authMiddleWare,
  characterValidatorJoiMiddleware.characterNameValidation,
  async (req, res, next) => {
    try {
      const { characterName } = req.body;
      const { userId } = req.user;

      const character = await prisma.characters.create({
        data: {
          characterName: characterName,
          userId: +userId,
        },
      });

      let msg = `캐릭터 생성: ${(character.characterId, character.characterName, character.userId)}`;

      return res.status(201).json({ characterId: msg });
    } catch (error) {
      next(error);
    }
  },
);

// 현재 userId의 캐릭터들의 Id로 정보 조회
router.get(
  '/characters/:characterId',
  authMiddleWare,
  characterValidatorJoiMiddleware.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      const { userId } = req.user;

      const character = await prisma.characters.findFirst({
        where: {
          characterId: characterId,
        },
        select: {
          userId: true,
          characterName: true,
          health: true,
          power: true,
          money: true,
        },
      });

      if (!userId || !character) {
        return res.status(401).json({ errormessage: '유저 정보가 조회되지 않습니다.' });
      }

      return res.status(200).json({
        message: '캐릭터 정보가 조회되었습니다.',
        data: {
          ...character,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// 캐릭터 Id를 토대로 캐릭터 데이터 업데이트 health, power, money
router.put(
  '/characters/:characterId',
  authMiddleWare,
  characterValidatorJoiMiddleware.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      const { userId } = req.user.userId;
      let { health, power, money } = req.body;

      const character = await prisma.characters.findUnique({
        where: {
          characterId: characterId,
        },
      });

      if (!health) {
        health = character.health;
      }
      if (!power) {
        power = character.power;
      }
      if (!money) {
        money = character.money;
      }

      if (!character) {
        return res.status(404).json({ errormessage: '유저 정보가 조회되지 않습니다.' });
      }

      const updateCharacter = await prisma.characters.update({
        data: {
          health: health,
          power: power,
          money: money,
        },
        where: {
          characterId: characterId,
          userId: userId,
        },
      });

      return res
        .status(200)
        .json({ data: '유저 정보가 업데이트되었습니다.', message: updateCharacter });
    } catch (error) {
      next(error);
    }
  },
);

// 캐릭터 삭제
router.delete(
  '/characters/:characterId',
  authMiddleWare,
  characterValidatorJoiMiddleware.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      const user = req.user;
      const { password } = req.body;

      const character = await prisma.characters.findFirst({
        where: { characterId: characterId},
      });

      console.log("character => ", character);

      if (!character) 
        return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });
      else if (!(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

      await prisma.characters.delete({
        where: { characterId: characterId},
      })

      return res.status(200).json({data: '캐릭터가 삭제되었습니다.'});
    } catch (error) {
      next(error);
    }
  },
);

export default router;
