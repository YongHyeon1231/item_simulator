import express from 'express';
import { prisma } from '../lib/utils/prisma/index.js';
import characterValidatorJoi from '../middlewares/validators/characterValidator.middleware.js';
import userAuthMiddleware from '../middlewares/auths/user-auth.middleware.js';
import itemValidatorJoiMiddleware from '../middlewares/validators/itemsValidator.middleware.js';

const router = express.Router();

// 특정 캐릭터 장비 상태 조회
router.get(
  '/equipments/:characterId',
  characterValidatorJoi.characterIdValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;

      const equipmentItems = await prisma.equipments.findMany({
        where: { characterId: characterId },
        select: {
          itemCode: true,
        },
      });
      let msg = {equipmentItems: [...equipmentItems]}
      //return res.status(200).json([...equipmentItems]);
      return res.status(200).json(msg);
    } catch (error) {
      next(error);
    }
  },
);

// 캐릭터 장비 equip/unequip
router.put(
  '/equipments/:characterId/inventories',
  userAuthMiddleware,
  characterValidatorJoi.characterIdValidation,
  itemValidatorJoiMiddleware.itemCodeBodyValidation,
  itemValidatorJoiMiddleware.itemEquipValidation,
  async (req, res, next) => {
    try {
      const characterId = req.params.characterId;
      const { itemCode, equip } = req.body;

      const character = await prisma.characters.findFirst({
        where: { characterId: characterId },
      });

      const item = await prisma.items.findFirst({
        where: { itemCode: +itemCode },
      });

      const inventory = await prisma.inventories.findFirst({
        where: { itemCode: +itemCode, characterId: characterId },
      });

      const equipment = await prisma.equipments.findFirst({
        where: { characterId: characterId, itemCode: +itemCode },
      });

      if (!character) return res.status(401).json({ message: '해당 캐릭터는 없습니다.' });
      if (!item)
        return res.status(401).json({ message: '해당 아이템코드에 부합하는 아이템은 없습니다.' });
      // 장착하려고 하는데 인벤토리에 없으면 에러 반환
      if (!inventory && equip)
        return res
          .status(401)
          .json({ message: `해당 캐릭터의 인벤토리에 ${item.itemName}는 없습니다.` });

      if (equip) {
        //장착하려고 할때 equipments 생성
        await prisma.equipments.create({
          data: {
            characterId: characterId,
            itemCode: +itemCode,
          },
        });
      } else {
        // 장착해제하려고 할때 해당 equipments 삭제
        await prisma.equipments.delete({
          where: { equipmentId: equipment.equipmentId },
        });
      }

      // 캐릭터 상태 업데이트
      const presentCharacter = await prisma.characters.update({
        where: {
          characterId: characterId,
        },
        data: {
          health: {
            increment: equip ? item.itemStat.health : -item.itemStat.health,
          },
          power: {
            increment: equip ? item.itemStat.power : -item.itemStat.power,
          },
        },
      });

      // 인벤토리 업데이트
      let presentInventory = await prisma.inventories.update({
        where: { inventoryId: inventory.inventoryId, characterId: characterId },
        data: {
          count: {
            increment: equip ? -1 : +1,
          },
        },
      });

      if (presentInventory.count === 0 && equip) {
        // 장착 후 인벤토리에 템이 0개라면 인벤토리 삭제
        await prisma.inventories.delete({
          where: { inventoryId: inventory.inventoryId, characterId: characterId },
        });
      } else if (presentInventory.count === 1 && !equip) {
        // 장착 해제 후 인벤토리에 템이 1개라면 인벤토리 생성 <- 나중에 비어있는 인벤토리 번호를 생각해야 할듯
        await prisma.inventories.create({
          data: {
            characterId: characterId,
            itemCode: +itemCode,
            count: +1,
          },
        });
      }

      // 현재 캐릭터 인벤토리 정보
      const inventoryResult = prisma.inventories.findMany({
        where: { characterId: req.params.characterId },
        select: {
          characterId: true,
          itemCode: true,
          count: true,
        },
      });

      let msg = {
        message: `${item.itemName}${equip ? ' equip' : ' unequip'}에 성공하였습니다.`,
        character: presentCharacter,
        Inventory: inventoryResult,
      };
      return res.status(200).json(msg);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
