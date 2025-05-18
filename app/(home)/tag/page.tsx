'use client';

import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import * as ANTD_ICONS from '@ant-design/icons';
import { Empty, Tabs, Button, message } from 'antd';
import type { TabsProps } from 'antd';
import { useAppSelector } from '@/store/hooks';
import request from '@/app/util/fetch';
import { Tag } from '@/db/entity';

export default function Page() {

    const [messageApi, contextHolder] = message.useMessage();
    const user = useAppSelector((state) => state.user);
    const [followTags, setFollowTags] = useState<Tag[]>([]);
    const [allTags, setAllTags] = useState<Tag[]>([]);

    console.log(user.id);

    // 关注标签
    function handleOnfollow(tagId: number, userId: number) {
      request.post('/api/tag/follow', {
        tagId,
        userId
      }).then((res) => {
        if(res.code === 0) {
          messageApi.open({
            type: 'success',
            content: res.msg,
          });
          setAllTags(res.data.tags);
          setFollowTags(res.data.followTags);
        } else {
          messageApi.open({
            type: 'error',
            content: res.msg,
          })
        }
      })
    }

    // 取消关注标签
    function handleOnUnfollow(tagId: number, userId: number) {
      request.post('/api/tag/unfollow', {
        tagId,
        userId
      }).then((res) => {
        if(res.code === 0) {
          messageApi.open({
            type: 'success',
            content: res.msg,
          });
          setAllTags(res.data.tags);
          setFollowTags(res.data.followTags);
        } else {
          messageApi.open({
            type: 'error',
            content: res.msg,
          })
        }
      })
    }

    // 获取所有标签和关注的标签
    useEffect(() => {
        request.get('/api/tag/get').then((res) => {
            if(res.code === 0) {
              setAllTags(res.data.allTags);
              setFollowTags(res.data.followTags);
            }
        })
    }, [user]);

  const items: TabsProps['items'] = [
    {
          key: '1',
          label: '关注标签',
          children: <div className={styles.tags}>
            {
                (user.id && followTags.length) ? (
                  followTags?.map(tag => {
                    return (
                        <div key={tag.id} className={styles.tag}>
                            <div className={styles.tagWrapper}>
                                <div className={styles.icon}>{React.createElement(ANTD_ICONS[tag.icon as keyof typeof ANTD_ICONS] as React.ComponentType)} </div>
                                <div className={styles.title}>{tag.title}</div>
                                <div>{tag.follow_count} 关注 {tag.article_count} 文章</div>
                                {
                                  <Button
                                    onClick={() => handleOnUnfollow(tag.id, user.id as number)}
                                    type="primary" 
                                    danger
                                  >取消关注</Button>
                                }
                            </div>
                        </div>
                );})
                ):(
                    <Empty 
                      description="暂无关注标签"
                      style={{ margin: '0 auto' }}
                    />
                )
            }
          </div>,
        },
        {
          key: '2',
          label: '所有标签',
          children: <div className={styles.tags}>
            {
                allTags.map(tag => {
                    return (
                        <div key={tag.id} className={styles.tag}>
                            <div className={styles.tagWrapper}>
                                <div>{React.createElement(ANTD_ICONS[tag.icon as keyof typeof ANTD_ICONS] as React.ComponentType)} </div>
                                <div className={styles.title}>{tag.title}</div>
                                <div>{tag.follow_count} 关注 {tag.article_count} 文章</div>
                                {
                                  user.id && (
                                    // 当前用户是否关注
                                    tag.users.find(followUser => followUser.id === user.id) ? (
                                      <Button
                                        onClick={() => handleOnUnfollow(tag.id, user.id as number)}
                                        type="primary" 
                                        danger
                                      >取消关注</Button>
                                    ) : (
                                      <Button 
                                        type="primary"
                                        onClick={() => handleOnfollow(tag.id, user.id as number)}
                                      >关注</Button>
                                    )
                                  )
                                }
                            </div>
                        </div>
                );})
            }
          </div>,
        },
        
  ];


    return (
        <div className="content-layout">
          {contextHolder}
          <Tabs
              defaultActiveKey="1"
              centered
              items={items}
          />
        </div>
    );
}