"use client";

import { usePathname } from 'next/navigation';
import { HomeOutlined, QuestionCircleOutlined, TagOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import Link from 'next/link';


export default function NavLinks() {
    const pathname = usePathname();

    const iconStyle = { padding: '0 5px', fontSize: '18px' };
    const navs = [
        {
            label: '首页',
            value: '/',
            icon: <HomeOutlined
                style={iconStyle}
            />,
        },
        {
            label: '咨询',
            value: '/info',
            icon: <QuestionCircleOutlined
                style={iconStyle}
            />,
        },
        {
            label: '标签',
            value: '/tag',
            icon: <TagOutlined 
                style={iconStyle}
            />,
        },
    ]

    return (
        <>
            {
                navs?.map(nav => {
                    const isActive = pathname === nav.value;
                    return (
                        <Link key={nav.label} href={nav.value}>
                            <span className={isActive ? styles.active : ""}>
                                {nav.icon}
                                {nav.label}
                            </span>
                        </Link>
                    )
                })
            }
        </>
    );
}