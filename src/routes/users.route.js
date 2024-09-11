import express from 'express';
import { prisma } from '../lib/utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userValidatorJoiMiddleware from '../middlewares/validators/userValidator.middleware.js';
import authMiddleWare from '../middlewares/auths/user-auth.middleware.js';

const router = express.Router();

router.post(
  '/users/sign-up',
  userValidatorJoiMiddleware.signUpValidation,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const isExistUser = await prisma.users.findFirst({
        where: {
          username,
        },
      });

      if (isExistUser) {
        return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.users.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });

      return res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/users/sign-in',
  userValidatorJoiMiddleware.signInValidation,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
        
      const user = await prisma.users.findFirst({
        where: { username: username },
      });
      
      if (!user) {
        return res.status(401).json({ message: '존재하지 않은 유저입니다.' });
      } else if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
      
      const token = jwt.sign(
        {
          userId: user.userId,
          username: username,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 3000,
        },
      );

      res.cookie('authorization', `Bearer ${token}`);
      return res.status(200).json({ message: '로그인 성공' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/users/get/:username', authMiddleWare, async (req, res, next) => {
  const { username } = req.params;

  const user = await prisma.users.findFirst({
    where: { username: username },
    select: {
      userId: true,
      username: true,
      characters: {
        select: {
          characterId: true,
          characterName: true,
          power: true,
          health: true,
          money: true,
        },
      },
    },
    orderBy: {
        userId: 'desc',
    },
  });

  return res.status(200).json({ data: user });
});

export default router;
