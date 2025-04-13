"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './index.module.scss';
import { Button } from 'antd';
import { useState } from 'react';
import Login from '@/app/_components/Login';

const navs = [
    {
        label: '首页',
        value: '/',
    },
    {
        label: '咨询',
        value: '/info',
    },
    {
        label: '标签',
        value: '/tag',
    },
]

export default function Navbar () {
    const pathname = usePathname();
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
                {
                    navs?.map(nav => {
                        return (
                            <Link key={nav.label} href={nav.value}>
                                <span className={pathname === nav.value ? styles.active : ""}>{nav.label}</span>
                            </Link>
                        )
                    })
                }
            </section>
            <section className={styles.operaArea}>
                <Button onClick={handleOnGotoEditorPage}>写文章</Button>
                <Button 
                    type="primary"
                    onClick={handleOnClickLogin}
                >登录</Button>
            </section>
            <Login 
                visible={isShowLogin}
                onClose={handleOnCloseLogin}
            />
        </div>
    );
}