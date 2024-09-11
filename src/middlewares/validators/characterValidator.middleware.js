import Joi from "joi";

const characterIdSchema = Joi.object({
    characterId: Joi.number().integer().min(1).required(),
});

// trim 공백제거
const characterNameSchema = Joi.object({
    characterName: Joi.string().trim().min(2).max(20).required(),
});

const characterValidatorJoi = {
    characterNameValidation: async function(req, res, next) {
        const validation = characterNameSchema.validate(req.body);

        if (validation.error) {
            console.log("characterNameSchema: ", validation.error.message, "2~20 문자 공백제거");
            let msg = "요구사항 : string().trim().min(2).max(20)";
            return res.status(400).json({message: msg});
        }

        next();
    },
    characterIdValidation: async function (req, res, next) {
        const validation =  characterIdSchema.validate(req.params);

        if (validation.error) {
            console.log("characterIdSchema: ", validation.error.message, "2~10 문자 공백제거");
            let msg = "요구사항 : number().integer().min(1)";
            return res.status(400).json({message: msg});
        }

        // 유효인증 할 때 미리 int형으로 형변환해두기
        req.params.characterId = parseInt(req.params.characterId);
        next();
    }
}

export default characterValidatorJoi;