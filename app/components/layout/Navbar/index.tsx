"use client";
import styles from './index.module.scss';
import NavLinks from './nav-links';
import { Button, Dropdown, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import Login from '@/app/components/Login';
import {  useAppDispatch, useAppSelector } from '@/store/hooks';
import { initializeUser } from '@/store/modules/userStore';
import type { MenuProps } from 'antd/es/menu';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import request from '@/app/util/fetch';
import { useRouter } from 'next/navigation';



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
        dispatch(initializeUser());
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
        request.post('/api/user/logout').then((res: any) => {
            if(res.code === 0) {
                console.log('退出登录成功');
                dispatch(initializeUser());
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
                <section className={styles.logoArea}>MY-BLOG</section>
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