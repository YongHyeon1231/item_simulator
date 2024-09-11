import express from 'express';
import { prisma } from '../lib/utils/prisma/index.js';
import userAuthMiddleware from '../middlewares/auths/user-auth.middleware.js';
import characterValidatorJoi from '../middlewares/validators/characterValidator.middleware.js';

const router = express.Router();

// model Inventories {
//     inventoryId String @id @default(uuid()) @map("inventoryId")

//     characterId Int @map("characterId")

//     itemCode Int @map("itemCode")
//     count Int @default(0) @map("count")

//     characters Characters @relation(fields: [characterId], references: [characterId], onDelete: Cascade)
//     items Items @relation(fields:[itemCode], references: [itemCode], onUpdate: Cascade)

//     @@map("Inventories")
//   }

// 인벤토리 아이템 추가
router.post(
  '/characters/:characterId/inventories',
  userAuthMiddleware,
  characterValidatorJoi.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      const user = req.user;
      const { itemCode } = req.body;
      let msg;
      const character = await prisma.characters.findFirst({
        where: { characterId: characterId, userId: +user.userId },
      });

      if (!character) return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });

      const slot = await prisma.inventories.findFirst({
        where: { characterId: characterId, itemCode: +itemCode },
      });

      console.log('slot => ', slot);

      if (!slot) {
        const inventoryItem = await prisma.inventories.create({
          data: {
            characterId: characterId,
            itemCode: +itemCode,
            count: +1,
          },
        });
        msg = { message: '인벤토리 새로운 슬롯이 생성되었습니다.', data: inventoryItem };
      } else {
        console.log('여기가 문제잖아?');
        const inventoryItem = await prisma.inventories.update({
          where: { inventoryId: slot.inventoryId, characterId: characterId, itemCode: +itemCode },
          data: {
            count: +slot.count + 1,
          },
        });
        msg = { message: '기존에 있던 인벤토리 슬롯이 업데이트 되었습니다.', data: inventoryItem };
      }
      console.log('여기가 문제잖아?!#@#');
      return res.status(200).json(msg);
    } catch (error) {
      next(error);
    }
  },
);

// 특정 캐릭터 인벤토리 전체 조회
router.get(
  '/characters/:characterId/inventories',
  userAuthMiddleware,
  characterValidatorJoi.characterIdValidation,
  async (req, res, next) => {
    const inventories = await prisma.inventories.findMany({
      where: { characterId: req.params.characterId },
      select: {
        characterId: true,
        itemCode: true,
        count: true,
      },
    });

    return res.status(200).json({ data: inventories });
  },
);

export default router;
