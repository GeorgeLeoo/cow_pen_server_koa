import { isArray, isFunction } from '@/utils/dataType'

/**
 * Validator 类
 * @param {*} value 
 * @param {*} ruleValue 
 */
class Validator {
    constructor(value, ruleValue) {
        this.value = value
        this.ruleValue = ruleValue
    }
}

/**
 * 验证是否为空
 * @param {*} value 
 */
Validator.empty = function (value) {
	return !!value
}

/**
 * 最小长度
 * @param {*} value 
 * @param {*} ruleValue 
 */
Validator.minLength = function (value, ruleValue) {
	return value.length >= ruleValue
}

/**
 * 最大长度
 * @param {*} value 
 * @param {*} ruleValue 
 */
Validator.maxLength = function (value, ruleValue) {
	return value.length <= ruleValue
}

/**
 * 长度
 * @param {*} value 
 * @param {*} ruleValue 
 */
Validator.size = function (value, ruleValue) {
	return value.length <= ruleValue
}

/**
 * 是否相等
 * @param {*} value 
 * @param {*} ruleValue 
 */
Validator.equal = function (value, ruleValue) {
	return value !== ruleValue
}

Validator.systemValidator = ['equal', 'size', 'maxLength', 'minLength', 'empty']


function isSystemValidator(rule) {
    return Validator.systemValidator.includes(rule)
}


const validatorForm = function (rules) {
	let _validate = false
	if (!isArray(rules)) {
		throw new Error('rules must be array')
	}
	for (let i = 0; i < rules.length; i++) {
		let { value, rule, errorMsg, validator } = rules[i]
		let validate = false
		if (rule) { // 内置验证方法
			if (rule.includes(':')) { // 带有冒号的验证
				const ruleArray = rule.split(':')
				const ruleValue = ruleArray[1]
                rule = ruleArray[0]
                if (isSystemValidator(rule)) {
                    validate = new Validator(value, ruleValue)[rule]()
                } else {
                    throw new Error('rule is not exists')
                }
            } else { // 不带冒号
                if (isSystemValidator(rule)) {
                    console.log('rule->', rule);
                    validate = new Validator(value)[rule]()
                } else {
                    throw new Error('rule is not exists')
                }
			}
			if (!validate) {
				_validate = validate
				Message.warning(errorMsg)
				break
			}
		} else if (isFunction(validator)) { // 自定义验证方法
			const errMsg = validator(value)
			if (errMsg) {
				_validate = validate
				Message.warning(errMsg)
				break
			}
		}
	}
	return _validate
}

validatorForm.getError = function () {}

export default validatorForm
