import Joi from "joi";

const signUpSchema = Joi.object({
    // alphanum : 문자열 값에는 az, AZ, 0-9만 포함되어야 합니다.
    // lowercase : 문자열 값이 모두 소문자여야 합니다.
    // valid : 제공된 값 목록에 허용 값 모록을 추가하고 다음과 같은 경우에만 허용되는 유효한 값으로 표시
    // options ref() - 내부 참조를 만들 때 사용되는 선택적 설정
    username: Joi.string().alphanum().lowercase().min(4).max(12).required(),
    password: Joi.string().min(6).max(20).required(),
    passwordConfirmation: Joi.string().valid(Joi.ref("password")).required(),
});

const signInSchema = Joi.object({
    username: Joi.string().alphanum().lowercase().min(4).max(12).required(),
    password: Joi.string().min(6).max(20).required(),
})

const userValidatorJoi = {
    signUpValidation: async function (req, res, next) {
        const validation = await signUpSchema.validateAsync(req.body);

        if (validation.error) {
            console.log(req.origianl)
        }
        
    }

}

export default userValidatorJoi;