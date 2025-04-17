export default function validPhone ( phone: string ) {
    // 手机号正则表达式
    const phoneReg = /^1[3-9]\d{9}$/;
    // 验证手机号格式
    if ( !phoneReg.test( phone ) ) {
        return false;
    }
    return true;
}