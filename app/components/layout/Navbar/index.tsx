"use client";
import styles from './index.module.scss';
import NavLinks from './nav-links';
import { Button, Dropdown, Avatar } from 'antd';
import { useState } from 'react';
import Login from '@/app/components/Login';
import { useAppSelector } from '@/store/hooks';
import type { MenuProps } from 'antd/es/menu';
import Link from 'next/link';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';



const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link href={'/'}>
            个人主页
        </Link>
      ),
      icon: <HomeOutlined />,
    },
    {
      key: '2',
      label: (
        <span>
            退出登录
        </span>
      ),
      icon: <LogoutOutlined />,
    },
];


export default function Navbar () {
    // 加载用户信息
    const user = useAppSelector((state) => state.user);

    const [isShowLogin, setIsShowLogin] = useState(false);
    function handleOnGotoEditorPage () {
        return ;
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