"use client";
import styles from './index.module.scss';
import NavLinks from './nav-links';
import { Button, Dropdown, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import Login from '@/app/_components/Login';
import {  useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/modules/userStore';
import type { MenuProps } from 'antd/es/menu';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import request from '@/app/util/fetch';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Navbar () {
    const router = useRouter();
    const items: MenuProps['items'] = [
        {
          key: '1',
          label: (
            <span className={styles.menuOption}  onClick={handleOnUserInfo}>
                个人主页
            </span>
          ),
          icon: <HomeOutlined />,
        },
        {
          key: '2',
          label: (
            <span className={styles.menuOption} onClick={handleOnLogout}>
                退出登录
            </span>
          ),
          icon: <LogoutOutlined />,
        },
    ];


    // 初始化用户状态
    const dispatch = useAppDispatch();
    useEffect(() => {
        const user = {
            id: null,
            nickname: '',
            avatar: ''
        }
        request.get('/api/user/getUserInfo')
        .then((res) => {
            if( res.code == 0 ){
                user.id = res.data.id;
                user.nickname = res.data.nickname;
                user.avatar = res.data.avatar;
            }
            dispatch(setUser(user));
        });
    }, [dispatch]);

    // 加载用户信息
    const user = useAppSelector((state) => state.user);

    // 是否显示登录弹窗
    const [isShowLogin, setIsShowLogin] = useState(false); 

    // 跳转到文章编辑页面
    function handleOnGotoEditorPage () {
        if(!user?.id) {
            setIsShowLogin(true);
            return;
        }else{
            router.push('/editor/new');
        }
    }

    // 跳转到个人主页
    function handleOnUserInfo () {
        router.push(`/user/${user?.id}`);
    }

    // 退出登录
    function handleOnLogout () {
        request.post('/api/user/logout').then((res) => {
            if(res.code === 0) {
                dispatch(setUser({
                    id: null,
                    nickname: '',
                    avatar: ''
                }));
                router.refresh();
            }
        })
    }

    function handleOnClickLogin () {
        setIsShowLogin(true);
    }

    function handleOnCloseLogin () {
        setIsShowLogin(false);
    }

    return (
            <div className={styles.navbar}>
                <section className={styles.logoArea}>
                    <Image 
                        src='/my_blog_logo.svg' 
                        alt='logo' 
                        width={50} 
                        height={50}
                        style={{ marginRight: '10px'}}
                    />
                    MY-BLOG
                </section>
                <section className={styles.linkArea}>
                    <NavLinks />
                </section>
                <section className={styles.operaArea}>
                    <Button onClick={handleOnGotoEditorPage}>写文章</Button>

                    {
                        user?.id ? 
                        <Dropdown 
                            menu={{ items }}
                        >
                            <Avatar size={32} src={user.avatar} />
                        </Dropdown>
                        :<Button 
                            type="primary"
                            onClick={handleOnClickLogin}
                        >登录</Button>
                    }
        
                </section>
                
                <Login 
                    visible={isShowLogin}
                    onClose={handleOnCloseLogin}
                />
                
            </div>
    );
}