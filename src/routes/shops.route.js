import express from 'express';
import { prisma } from '../lib/utils/prisma/index.js';
import userAuthMiddleware from '../middlewares/auths/user-auth.middleware.js';
import characterValidatorJoi from '../middlewares/validators/characterValidator.middleware.js';
import itemValidatorJoi from '../middlewares/validators/itemsValidator.middleware.js';

const router = express.Router();

// 상점에서 아이템 구매
router.post(
  '/shops/:characterId',
  userAuthMiddleware,
  characterValidatorJoi.characterIdValidation,
  itemValidatorJoi.itemCodeBodyValidation,
  itemValidatorJoi.itemCountValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      const user = req.user;
      const { itemCode, count } = req.body;

      const item = await prisma.items.findFirst({
        where: { itemCode: +itemCode },
        select: {
          itemName: true,
          itemPrice: true,
        },
      });
      if (!item) return res.status(404).json({ message: '해당 아이템코드는 잘못되었습니다.' });

      const character = await prisma.characters.findFirst({
        where: { characterId: characterId, userId: +user.userId },
        select: {
          money: true,
        },
      });
      if (!character) return res.status(404).json({ message: '해당 유저가 없습니다.' });

      const inventory = await prisma.inventories.findFirst({
        where: { characterId: characterId, itemCode: +itemCode },
        select: {
          inventoryId: true,
          count: true,
        },
      });

      const enoughMoney = character.money - item.itemPrice * count;

      if (enoughMoney >= 0) {
        await prisma.characters.update({
          where: { characterId: characterId, userId: +user.userId },
          data: {
            money: enoughMoney,
          },
        });

        if (inventory) { // 인벤토리에 같은 아이템이 있거나 없거나 나눔
          await prisma.inventories.update({
            where: {inventoryId: inventory.inventoryId},
            data: {
                count: {
                    increment: count,
                },
            },
          });
        } else {
            await prisma.inventories.create({
                data: {
                    characterId: characterId,
                    itemCode: +itemCode,
                    count: +count
                },
            });
        }
      }
      const msg = {message: `아이템 ${item.itemName}을 ${count}만큼 구매를 완료하였습니다.`, updatedMoney: `남은 소지금은 ${enoughMoney}입니다.`};
      return res.status(200).json(msg);
    } catch (error) {
      next(error);
    }
  },
);

// 아이템 판매
router.patch("/shops/:characterId",
    userAuthMiddleware,
    characterValidatorJoi.characterIdValidation,
    itemValidatorJoi.itemCodeBodyValidation,
    itemValidatorJoi.itemCountValidation,
    async(req,res,next) => {
        try {
            const characterId = req.params.characterId;
            const user = req.user;
            const {itemCode, count} = req.body;

            const character = await prisma.characters.findFirst({
                where: {characterId: characterId, userId: +user.userId}
            });
            const item = await prisma.items.findFirst({
                where: {itemCode: +itemCode}
            });
            const inventory = await prisma.inventories.findFirst({
                where: {characterId: characterId, itemCode: +itemCode}
            });

            if (!item) return res.status(404).json({ message: '해당 아이템코드는 잘못되었습니다.' });
            if (!character) return res.status(404).json({ message: '해당 유저가 없습니다.' });
            if (!inventory) return res.status(404).json({ message: '해당 아이템이 인벤토리에 없습니다.' });
            if (inventory.count < count) return res.status(404).json({ message: '판매하려는 아이템 수가 너무 많습니다.' });
            const updatedMoney = character.money + Math.floor(item.itemPrice * count * 0.6);

            const updateInventory = await prisma.inventories.update({
                where: {inventoryId: inventory.inventoryId, characterId: characterId},
                data: {
                    count: {
                        increment: -count
                    },
                },
            });

            await prisma.characters.update({
                where: {characterId: characterId, userId: user.userId},
                data: {
                    money: updatedMoney
                },
            });

            if (updateInventory.count === 0) {
                await prisma.inventories.delete({
                    where: {inventoryId: inventory.inventoryId, characterId: characterId}
                })
            }

            const msg = {message: `아이템 ${item.itemName}을 ${count}개 만큼 판매 완료하였습니다.`, updatedMoney: `현재 소지금: ${updatedMoney}`};
            return res.status(200).json(msg);
        } catch(error) {
            next(error);
        }
    }
)


export default router;
