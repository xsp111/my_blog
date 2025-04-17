"use client";

import { usePathname } from 'next/navigation';
import { HomeFilled, QuestionCircleFilled, TagFilled } from '@ant-design/icons';
import styles from './index.module.scss';
import Link from 'next/link';


const iconStyle = { padding: '0 5px', fontSize: '18px', color: '#1e80ff' };
const navs = [
    {
        label: '首页',
        value: '/',
        icon: <HomeFilled 
            style={iconStyle}
        />,
    },
    {
        label: '咨询',
        value: '/info',
        icon: <QuestionCircleFilled 
            style={iconStyle}
        />,
    },
    {
        label: '标签',
        value: '/tag',
        icon: <TagFilled 
            style={iconStyle}
        />,
    },
]

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {
                navs?.map(nav => {
                    const isActive = pathname === nav.value;
                    return (
                        <Link key={nav.label} href={nav.value}>
                            <span className={isActive ? styles.active : ""}>
                                {isActive && nav.icon}
                                {nav.label}
                            </span>
                        </Link>
                    )
                })
            }
        </>
    );
}