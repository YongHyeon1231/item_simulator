import express from 'express';
import { prisma } from '../lib/utils/prisma/index.js';
import itemValidatorJoiMiddleware from '../middlewares/validators/itemsValidator.middleware.js';

const router = express.Router();

// 아이템 생성
router.post(
  '/items',
  itemValidatorJoiMiddleware.itemCodeBodyValidation,
  itemValidatorJoiMiddleware.itemNameValidation,
  itemValidatorJoiMiddleware.itemStatValidation,
  itemValidatorJoiMiddleware.itemPriceValidation,
  async (req, res, next) => {
    try {
      const { itemCode, itemName, itemStat, itemPrice } = req.body;

      const item = await prisma.items.create({
        data: { itemCode, itemName, itemStat, itemPrice },
      });

      if (!item)
        return res.status(400).json({ errormessage: 'item이 제대로 생성되지 않았습니다.' });

      console.log('아이템 =>', item);

      return res.status(201).json({ message: '성공적으로 아이템이 추가되었습니다.' });
    } catch (error) {
      next(error);
    }
  },
);

// 아이템 코드로 아이템 정보 불러오기
router.get("/items/:itemCode",
    itemValidatorJoiMiddleware.itemCodeParamsValidation,
    async (req, res, next) => {
        try {
            const itemCode = req.params.itemCode;
            const item = await prisma.items.findFirst({
                where: { itemCode: itemCode},
                select: {
                    itemCode: true,
                    itemName: true,
                    itemStat: true,
                    itemPrice: true,
                }
            });

            return res.status(200).json({message: item});
        } catch (error) {
            next(error);
        }
    }
)

// 모든 아이템 불러오기
router.get("/items",
    async (req, res, next) => {
        try {
            const items = await prisma.items.findMany({
                select: {
                    itemCode: true,
                    itemName: true,
                    itemStat: true,
                    itemPrice: true,
                },
                orderBy: {itemCode: "asc"},
            });

            return res.status(200).json({message: items});
        } catch (error) {
            next(error);
        }
    }
)

// 특정 아이템 정보 업데이트
router.put("/items/:itemCode",
    itemValidatorJoiMiddleware.itemCodeParamsValidation,
    itemValidatorJoiMiddleware.itemNameValidation,
    itemValidatorJoiMiddleware.itemStatValidation,
    itemValidatorJoiMiddleware.itemPriceValidation,
    async(req, res, next) => {
        try {
            const itemCode = req.params.itemCode;
            let { itemName, itemStat, itemPrice } = req.body;

            console.log("itemCode => ", itemCode);
            
            const originItem = await prisma.items.findFirst({
                where:{itemCode: itemCode},
            });

            console.log("originItem => ", originItem);

            if (!itemName) itemName = originItem.itemName;
            if (!itemStat) itemStat = originItem.itemStat;
            if (!itemPrice) itemPrice = originItem.itemPrice;

            const updateItem = await prisma.items.update({
                where: { itemCode: itemCode},
                data: {
                    itemName: itemName,
                    itemStat: itemStat,
                    itemPrice: itemPrice,
                }
            });

            const result = {message: `성공적으로 아이템 정보가 업데이트 되었습니다.`, data: updateItem};
            return res.status(200).json(result);
        } catch (error) {            
            next(error);
        }
    },
);

export default router;
