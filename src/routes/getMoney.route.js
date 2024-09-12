import express from "express";
import {prisma} from "../lib/utils/prisma/index.js";
import userAuthMiddleware from "../middlewares/auths/user-auth.middleware.js";
import characterValidatorJoi from "../middlewares/validators/characterValidator.middleware.js";

const router = express.Router();

// 돈 벌기
router.patch("/getMoney/:characterId",
    userAuthMiddleware,
    characterValidatorJoi.characterIdValidation,
    async (req, res, next) => {
        try {
            const characterId = req.params.characterId;
            const user = req.user;

            const character = await prisma.characters.findFirst({
                where: {characterId: characterId, userId: +user.userId}
            });

            if(!character) return res.status(401).json({message: "해당 캐릭터가 없습니다."})

            const EARNED = 1000;

            const presentCharacter = await prisma.characters.update({
                where: {characterId: characterId, userId: +user.userId},
                data: {
                    money : {
                        increment: +EARNED
                    }
                }
            })

            const msg = {message: `돈이 ${EARNED}만큼 추가되어 현재 소지금 ${presentCharacter.money}만큼 되었습니다.`};
            return res.status(200).json(msg);
        } catch(error) {
            next(error);
        }
    }
)

export default router;