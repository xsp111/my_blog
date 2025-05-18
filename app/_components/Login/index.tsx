
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import style from './index.module.scss';
import { useState } from 'react';
// import validPhone from '@/app/util/validPhone';
import request from '@/app/util/fetch';
import { message } from 'antd';
import { setUser } from '@/store/modules/userStore';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';


interface LoginProps {
    visible: boolean;
    onClose: () => void;
}



export default function Login ( { visible, onClose }: LoginProps ) {
    // 是否注册
    const [isSignUp, setIsSignUp] = useState( false );
    const [isVerifyPwdState, setIsVerifyPwdState] = useState( "" );

    const router = useRouter();
    const dispatch = useAppDispatch();

    //倒计时组件
    // const { Countdown } = Statistic;
    // const deadline = 60 ; // 倒计时60秒
    // const deadlineTime = useRef<number>(0); // 使用useRef来防止输入事件导致的组件渲染重置倒计时

    // 登陆状态组件
    const [messageApi, contextHolder] = message.useMessage();

    // 是否显示验证码倒计时
    // const [isShowCountDown, setIsShowCountDown] = useState( false ); 

    // 输入手机号是否合法
    // const [isPhoneInvalid, setIsPhoneInvalid] = useState( false ); 

    // 登录表单
    const [form, setForm] = useState({
        username: '',
        pwd: '',
    });
    // 注册表单
    const [signUpForm, setSignUpForm] = useState({
        username: '',
        pwd: '',
        verifyPwd: '',
    });

    // 处理登录输入框变化
    function handleOnFormChange ( e: React.ChangeEvent<HTMLInputElement> ) {
        const { name, value } = e?.target;
        setForm({
            ...form,
            [name]: value,
        });
    }
    // 处理注册输入框变化
    function handleOnSignUpFormChange ( e: React.ChangeEvent<HTMLInputElement> ) {
        const { name, value } = e?.target;
        setSignUpForm({
            ...signUpForm,
            [name]: value,
        });
    }
    function handleOnVerifyPwdChange ( e: React.ChangeEvent<HTMLInputElement> ) {
        handleOnSignUpFormChange( e );
        setSignUpForm(n => {
            // 实时验证密码是否一致
            if( n.pwd == n.verifyPwd ){
                setIsVerifyPwdState( '' );
            } else {
                setIsVerifyPwdState( 'error' );
            }
            return n;
        })
    }

    // 处理倒计时结束
    // function handleOnCountDownFinish () {
    //     setIsShowCountDown( false );
    // }

    function handleClose () {
        // handleOnCountDownFinish(); // 关闭倒计时
        onClose();
    }

    // 处理获取验证码
    // function handleOnGetVerifyCode () {
    //     // 判断手机号是否合法
    //     if ( validPhone(form.phone) ){
    //         setIsPhoneInvalid( false );
    //         // 发送请求获取验证码
    //         request.post('/api/user/sendVerifyCode',{
    //             to: form.phone,
    //             templateId: 1
    //         }).then((res) => {
    //             if ( res.code === 0 ) {
    //                 deadlineTime.current = Date.now() + deadline * 1000;
    //                 // 显示倒计时
    //                 setIsShowCountDown( true ); 
    //             }
    //         });
    //     } else {
    //         //输入手机号不合法，则清空输入框
    //         setForm({
    //             ...form,
    //             phone: '',
    //         });
    //         // 设置手机号不合法为true
    //         setIsPhoneInvalid( true );
    //     }
    // }

    // 处理注册事件
    function handleOnSignUp () {
        // 如果用户名或密码为空，则提示用户输入完整的用户名和密码
        if( signUpForm.username === '' || signUpForm.pwd === '' || isVerifyPwdState === 'error' ){
            messageApi.open({
                type: 'error',
                content: '请输入完整的用户名和密码',
            });
            return;
        } else {
            request.post('/api/user/signUp', {
                ...signUpForm,
                identity_type: 'pwd',
            }).then((res) => {
                if( res.code === 0 ){
                    messageApi.open({
                        type: 'success',
                        content: res.msg,
                    });
                    // 0.5秒后关闭登陆界面
                    setTimeout(() => {
                        setIsSignUp( false );
                    }, 500);
                } else {
                    messageApi.open({
                        type: 'error',
                        content: res.msg,
                    });
                }
            })
        }
    }


    // 处理登录事件
    function handleOnLogin () {
        // 如果用户名或密码为空，则提示用户输入完整的用户名和密码
        if( form.username === '' || form.pwd === '' ){
            messageApi.open({
                type: 'error',
                content: '请输入完整的用户名和密码',
            });
            return;
        }
        // 发送登录请求
        request.post('/api/user/login', {
            ...form,
            identity_type: 'pwd',
        }).then((res) => {
            // 如果返回的code为0，登录成功
            if( res.code === 0 ){
                // 保存用户信息
                dispatch(setUser(
                   res.data
                ));

                // 登陆成功提醒
                messageApi.open({
                    type: 'success',
                    content: res.msg,
                })
                // 0.5秒后关闭登陆界面
                setTimeout(() => {
                    router.refresh();
                    handleClose();
                }, 500);
            } else {
                // 触发登录失败提醒
                messageApi.open({
                    type: 'error',
                    content: res.msg,
                })
            }
        }) 
    }


    function handleOnChangToSignUp () {
        setIsSignUp( !isSignUp );
    }


    return (
        visible ? (
            isSignUp ? (
                <div className={style.loginArea}>
                    {contextHolder}
                    {/* 注册状态弹窗 */}
                    <div className={style.loginBox}>
                        <div className={style.loginTitle}>
                            <span>注册</span>
                            <span className={style.close} onClick={handleClose}>
                                <CloseOutlined />
                            </span>
                        </div>
                        <Input  
                            name='username'
                            type='text'
                            style={{ height:"37px", margin: "15px 0" }}
                            value={signUpForm.username}
                            onChange={handleOnSignUpFormChange }
                            placeholder='请输入您的用户名'
                        />
                        <div className={style.pwdArea}>
                            <Input.Password
                                name='pwd'
                                placeholder="请输入密码"
                                value={signUpForm.pwd}
                                onChange={handleOnSignUpFormChange}
                                style={{ height:"37px", marginBottom: "15px" }}
                            />
                            {/* 确认密码 */}
                            <Input.Password
                                name='verifyPwd'
                                placeholder="请再次输入密码"
                                value={signUpForm.verifyPwd}
                                onChange={handleOnVerifyPwdChange}
                                status={isVerifyPwdState}
                                style={{ height:"37px" }}
                            />
                            <div className={style.verifyPwdError}>
                                {isVerifyPwdState === 'error' && '两次输入的密码不一致'}
                            </div>
                        </div>
                        <div className={style.loginBtn} onClick={handleOnSignUp}>注册</div>
                        <div className={style.turnToSignUp} onClick={handleOnChangToSignUp}>
                            已有账号？点击登录
                        </div>
                    </div>
                </div>
            )
            : (
                <div className={style.loginArea}>
                    {/* 登录状态弹窗 */}
                    {contextHolder}
                    <div className={style.loginBox}>
                        <div className={style.loginTitle}>
                            <span>登录</span>
                            <span className={style.close} onClick={handleClose}>
                                <CloseOutlined />
                            </span>
                        </div>
                        {/* { isPhoneInvalid ? <Input //不合法时，error样式
                                                name='phone'
                                                placeholder="请输入正确的手机号" 
                                                value={form.phone}
                                                onChange={handleOnFormChange}
                                                style={{ height:"37px", margin: "15px 0" }}
                                                status="error" 
                                                prefix={<PhoneFilled />} 
                                            />
                            :   (<Input  
                                    name='phone'
                                    type='text'
                                    style={{ height:"37px", margin: "15px 0" }}
                                    value={form.phone}
                                    onChange={handleOnFormChange}
                                    placeholder='请输入手机号'
                                />)
                        } */}
                        <Input  
                            name='username'
                            type='text'
                            style={{ height:"37px", margin: "15px 0" }}
                            value={form.username}
                            onChange={handleOnFormChange}
                            placeholder='请输入用户名'
                        />
                        <div className={style.pwdArea}>
                            <Input.Password
                                name='pwd'
                                placeholder="请输入密码"
                                value={form.pwd}
                                onChange={handleOnFormChange}
                                style={{ height:"37px", marginBottom: "10px" }}
                            />
                            {/* <span className={style.verifyCode} onClick={handleOnGetVerifyCode}>
                                { isShowCountDown ? <Countdown 
                                                        value={deadlineTime.current} 
                                                        format='ss'
                                                        valueStyle={{ fontSize: '18px', color: '#1e80ff', position: 'absolute', top: '-4px', right: '4px', zIndex: 1}}
                                                        onFinish={handleOnCountDownFinish} 
                                                        /> 
                                : '获取验证码' }
                            </span> */}
                        </div>
                        <div className={style.loginBtn} onClick={handleOnLogin}>登录</div>
                        <div className={style.turnToSignUp} onClick={handleOnChangToSignUp}>
                            没有账号？点击注册
                        </div>
                        <div className={style.loginPrivacy}>
                            登录即同意
                            <a href='https://moco.imooc.com/privacy.html' target='_blank'>《隐私政策》</a>
                        </div>
                    </div>
                </div>
            )
        ) : null
    );
}