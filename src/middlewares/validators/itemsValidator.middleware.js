import Joi from 'joi';

// 한유정 튜터님께서 추천해주신 방법
const itemSchema = Joi.object({
  itemCode: Joi.number().integer().min(1000).required(),
  itemName: Joi.string().min(1).max(30).required(),
  itemStat: {
    health: Joi.number().integer().optional(),
    power: Joi.number().integer().optional(),
  },
  itemPrice: Joi.number().integer().required(),
});

// 제가 고안한 방법 <- 너무 관리가 불편하다.... (힝...)
const itemCodeSchema = Joi.object({
  itemCode: Joi.number().integer().min(1000).required(),
}).unknown(true);

const itemNameSchema = Joi.object({
  itemName: Joi.string().min(1).max(30).required(),
}).unknown(true);

// optional: 객체의 해당 필드가 선택 사항이라는 것을 명확하게 나타내는 방법
const itemStatSchema = Joi.object({
  itemStat: {
    health: Joi.number().integer().optional(),
    power: Joi.number().integer().optional(),
  },
}).unknown(true);

const itemCountSchema = Joi.object({
  count: Joi.number().integer().required(),
}).unknown(true);

const itemPriceSchema = Joi.object({
  itemPrice: Joi.number().integer().required(),
}).unknown(true);

// strict: 현재 키와 모든 자식 키에 대한 형 변환을 방지합니다.
// boolean() 과 number() 는 자동으로 strict() 모드 에서 실행됩니다 .
const itemEquipSchema = Joi.object({
  equip: Joi.boolean().strict().required(),
}).unknown(true);

const itemValidationErrorHandler = function (res, err, itemName) {
  console.log(`아이템 ${itemName} 유효 실패: `, err.message);
  let msg = `아이템 ${itemName} 유효 실패`;
  return res.status(400).json({ message: msg });
};

const itemValidatorJoi = {
  itemValidation: async function (req, res, next) {
    const validation = await itemSchema.validateAsync(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, 'req.body - itemValidation');
    }

    next();
  },
  itemCodeParamsValidation: async function (req, res, next) {
    console.log("에러위치 => ");
    const validation = await itemCodeSchema.validateAsync(req.params);
 
    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, 'req.params - Params');
    }

    req.params.itemCode = parseInt(req.params.itemCode);
    next();
  },
  itemCodeBodyValidation: async function (req, res, next) {
    try {
      // object니까 객체로 바꿔서 넣는법 {itemCode: req.body.itemCode}
      const validation = await itemCodeSchema.validateAsync(req.body);

      next();
    } catch (error) {
      return itemValidationErrorHandler(res, validation.error, 'req.body - Code Body');
    }
  },
  itemNameValidation: async function (req, res, next) {
    console.log('itemNameValidation => ', req.body);
    const validation = await itemNameSchema.validateAsync(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, 'req.body - name');
    }

    next();
  },
  itemStatValidation: async function (req, res, next) {
    const validation = await itemStatSchema.validateAsync(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, 'req.body - stat');
    }

    const { itemStat } = req.body;
    if (!itemStat) itemStat = { health: 0, power: 0 };

    if (!itemStat.health) itemStat.health = 0;
    if (!itemStat.power) itemStat.power = 0;

    req.body.itemStat = itemStat;

    next();
  },
  itemCountValidation: async function (req, res, next) {
    const validation = await itemCountSchema.validateAsync(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, 'req.body - Count');
    }

    next();
  },
  itemPriceValidation: async function (req, res, next) {
    const validation = await itemPriceSchema.validateAsync(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, 'req.body - price');
    }

    next();
  },
  itemEquipValidation: async function (req, res, next) {
    const validation = await itemEquipSchema.validateAsync(req.body);

    if (validation.error) {
      return itemValidationErrorHandler(res, validation.error, 'req.body - Equip boolean');
    }

    next();
  },
};

export default itemValidatorJoi;
