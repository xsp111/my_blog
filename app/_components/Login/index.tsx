import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import style from './index.module.scss';
import { useState } from 'react';



interface LoginProps {
    visible: boolean;
    onClose: () => void;
}

export default function Login ( { visible, onClose }: LoginProps ) {
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

    function handleClose () {
        onClose();
    }

    function handleOnGetVerifyCode () {
        return ;
    }

    function handleOnLogin () {
        return ;
    }


    function handleOnOAuthGithub () {
        return ;
    }

    return (
        visible ? (
            <div className={style.loginArea}>
                <div className={style.loginBox}>
                    <div className={style.loginTitle}>
                        <span>手机号登录</span>
                        <span className={style.close} onClick={handleClose}>
                            <CloseOutlined />
                        </span>
                    </div>
                    <Input
                        name='phone'
                        type='text'
                        style={{ height:"37px", margin: "15px 0" }}
                        value={form.phone}
                        onChange={handleOnFormChange}
                        placeholder='请输入手机号'
                    />
                    <div className={style.verifyCodeArea}>
                        <Input
                            name='verify'
                            type='text'
                            style={{ height:"37px", marginBottom: "10px" }}
                            value={form.verify}
                            onChange={handleOnFormChange}
                            placeholder='请输入验证码'
                        />
                        <span className={style.verifyCode} onClick={handleOnGetVerifyCode}>获取验证码</span>
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