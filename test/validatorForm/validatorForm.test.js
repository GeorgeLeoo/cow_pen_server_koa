import validatorForm from '@/utils/validatorForm'

test('validatorForm', () => {
    const rules = [
        { value: 'admin', errorMsg: '用户名不等为空', rule: 'empty' },
        // { value: 'pass', errorMsg: '密码不等为空' },
    ]
    const validator = validatorForm(rules)
    expect(validator).toBe(true)
});


// test('validatorForm', () => {
//     const rules = [
//         { value: '', errorMsg: '用户名不等为空' },
//         { value: 'pass', errorMsg: '密码不等为空' },
//     ]
//     const validator = validatorForm(rules)
//     expect(validator).toBe(false)
// });