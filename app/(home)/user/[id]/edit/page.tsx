'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Avatar, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import styles from './index.module.scss';
import request from '@/app/util/fetch';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

interface IUser {
    nickname: string;
    job: string;
    description: string;
    avatar: string;
}
export default function UserEdit(){
    const router = useRouter(); 
    const [messageApi, contextHolder] = message.useMessage();
    const [userInfo, setUserInfo] = useState<IUser>({
        nickname: '',
        job: '',
        description: '',
        avatar: '/avatar/default.png'
    });
    const inputStyle = {
        width: '250px',
        height: '37px',
    };

    // 上传头像的配置
    const props: UploadProps = {
        name: `avatar`,
        action: '/api/user/uploadAvatar',
        maxCount: 1,
        showUploadList: false,
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png';
            if (!isPNG) {
            message.error(`${file.name} is not a png file`);
            }
            return isPNG || Upload.LIST_IGNORE;
        },
        onChange: (info) => {
            if(info.file.status === 'done'){
                messageApi.open({
                    type: 'success',
                    content: '上传成功',
                });
                // 设置头像
                setUserInfo({
                    ...userInfo,
                    avatar: info.file.response.data
                });
                router.refresh();
            }else if(info.file.status === 'error'){
                messageApi.open({
                    type: 'error',
                    content: '上传失败',
                });
            }
        },
    };

    // 处理输入框或文本域的值变化
    function handleOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        // 获取事件目标元素的name属性和value属性
        const { name, value } = e.target;
        // 更新userInfo对象，将name属性对应的值设置为value
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    }

    // 处理修改用户信息
    function handleOnModify(){
        // 发送post请求，修改用户信息
        request.post('/api/user/editUser', {
            ...userInfo
        })
        .then((res) => {
            // 如果返回码为0，表示修改成功
            if( res.code == 0 ){
                // 弹出成功提示
                messageApi.open({
                    type: 'success',
                    content: res.msg,
                });
                // 0.5秒后跳转到用户详情页
                setTimeout(() => {
                    router.push(`/user/${res.data.id}`);
                }, 500);
            }else{
                // 弹出错误提示
                messageApi.open({
                    type: 'error',
                    content: res.msg,
                });
            }
        })
    }

    useEffect(() => {
        request.get('/api/user/editUser')
        .then((res) => {
            if( res.code == 0 ){
                setUserInfo(res.data);
            }
        });
    }, [])

    return (
        <div className="content-layout">
            {contextHolder}
            <div className={styles.editArea}>
                <h2>个人资料</h2>
                <div className={styles.avatar}>
                    <Avatar 
                        size={64}
                        src={userInfo.avatar ? userInfo.avatar : '/avatar/default.png'} 
                    />
                    <Upload {...props}>
                        <Button 
                            icon={<UploadOutlined />}
                            size='small'
                            style={{
                                marginTop: '5px',
                                fontSize: '14px',
                                textAlign: 'center'
                            }}  
                        >上传头像</Button>
                    </Upload>
                    <span className={styles.fontType}>仅支持.png</span>
                </div>
                <div className={styles.nickname}>
                    <span>用户名</span>
                    <Input 
                        name='nickname'
                        value={userInfo.nickname}
                        placeholder='请输入用户名'
                        style={inputStyle}
                        onChange={handleOnChange}
                    />
                </div>
                <div className={styles.job}>
                    <span>职业</span>
                    <Input 
                        name='job'
                        value={userInfo.job}
                        placeholder='请输入职业'
                        style={inputStyle}
                        onChange={handleOnChange}
                    />
                </div>
                <div className={styles.description}>
                    <span>简介</span>
                    <Input.TextArea
                        name='description'
                        value={userInfo.description}
                        placeholder='请输入简介'
                        onChange={handleOnChange}
                        style={{
                            ...inputStyle,
                            minHeight: '80px'
                        }}
                    />
                </div>
                <Button type="primary" onClick={handleOnModify}>
                    修改
                </Button>
            </div>
        </div>
    );
}