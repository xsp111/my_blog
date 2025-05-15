
import { Input } from 'antd';
import { CloseOutlined, PhoneFilled  } from '@ant-design/icons';
import style from './index.module.scss';
import { useRef, useState } from 'react';
import { Statistic } from 'antd';
import validPhone from '@/app/util/validPhone';
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
    const router = useRouter();
    const dispatch = useAppDispatch();
    //倒计时组件
    const { Countdown } = Statistic;
    const deadline = 60 ; // 倒计时60秒
    const deadlineTime = useRef<number>(0); // 使用useRef来防止输入事件导致的组件渲染重置倒计时

    // 登陆状态组件
    const [messageApi, contextHolder] = message.useMessage();

    // 是否显示验证码倒计时
    const [isShowCountDown, setIsShowCountDown] = useState( false ); 

    // 输入手机号是否合法
    const [isPhoneInvalid, setIsPhoneInvalid] = useState( false ); 
    const [form, setForm] = useState({
        phone: '',
        verify: '',
    });

    // 处理输入框变化
    function handleOnFormChange ( e: React.ChangeEvent<HTMLInputElement> ) {
        const { name, value } = e?.target;
        setForm({
            ...form,
            [name]: value,
        });
    }

    // 处理倒计时结束
    function handleOnCountDownFinish () {
        setIsShowCountDown( false );
    }

    function handleClose () {
        handleOnCountDownFinish(); // 关闭倒计时
        onClose();
    }

    // 处理获取验证码
    function handleOnGetVerifyCode () {
        // 判断手机号是否合法
        if ( validPhone(form.phone) ){
            setIsPhoneInvalid( false );
            // 发送请求获取验证码
            request.post('/api/user/sendVerifyCode',{
                to: form.phone,
                templateId: 1
            }).then((res) => {
                if ( res.code === 0 ) {
                    deadlineTime.current = Date.now() + deadline * 1000;
                    // 显示倒计时
                    setIsShowCountDown( true ); 
                }
            });
        } else {
            //输入手机号不合法，则清空输入框
            setForm({
                ...form,
                phone: '',
            });
            // 设置手机号不合法为true
            setIsPhoneInvalid( true );
        }
    }

    // 处理登录事件
    function handleOnLogin () {
        request.post('/api/user/login', {
            ...form,
            identity_type: 'phone',
        }).then((res) => {
            // 如果返回的code为0，登录成功
            if( res.code === 0 ){
                // 保存用户信息
                console.log(res.data);
                dispatch(setUser(
                   res.data
                ));

                // 登陆成功提醒
                messageApi.open({
                    type: 'success',
                    content: res.msg,
                });
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
                });
            }
        }) 
    }


    function handleOnOAuthGithub () {
        return ;
    }

    return (
        visible ? (
            <div className={style.loginArea}>
                {/* 登录状态弹窗 */}
                {contextHolder}
                <div className={style.loginBox}>
                    <div className={style.loginTitle}>
                        <span>手机号登录</span>
                        <span className={style.close} onClick={handleClose}>
                            <CloseOutlined />
                        </span>
                    </div>
                    { isPhoneInvalid ? <Input //不合法时，error样式
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
                    }
                    <div className={style.verifyCodeArea}>
                        <Input
                            name='verify'
                            type='text'
                            style={{ height:"37px", marginBottom: "10px" }}
                            value={form.verify}
                            onChange={handleOnFormChange}
                            placeholder='请输入验证码'
                        />
                        <span className={style.verifyCode} onClick={handleOnGetVerifyCode}>
                            { isShowCountDown ? <Countdown 
                                                    value={deadlineTime.current} 
                                                    format='ss'
                                                    valueStyle={{ fontSize: '18px', color: '#1e80ff', position: 'absolute', top: '-4px', right: '4px', zIndex: 1}}
                                                    onFinish={handleOnCountDownFinish} 
                                                    /> 
                            : '获取验证码' }
                        </span>
                    </div>
                    <div className={style.loginBtn} onClick={handleOnLogin}>登录</div>
                    <div className={style.otherLogin} onClick={handleOnOAuthGithub}>
                        使用GitHub登录
                    </div>
                    <div className={style.loginPrivacy}>
                        登录即同意
                        <a href='https://moco.imooc.com/privacy.html' target='_blank'>《隐私政策》</a>
                    </div>
                </div>
            </div>
        ) : null
    );
}