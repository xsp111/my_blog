'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './comment.module.scss';
import {Avatar, Button, Input, message} from 'antd';
import request from '@/app/util/fetch';

interface CommentInputProps {
    user: { 
        id: number, 
        nickname: string, 
        avatar: string 
    }, 
    articleId: number, 
}

export default function CommentInput({ user, articleId }: CommentInputProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const [commentInput, setCommentInput] = useState('');
    const router = useRouter();

    // 发表评论
    function handleOnComment() {
        request.post('/api/comment/publish', {
            articleId,
            content: commentInput
        }).then((res) => {
            if (res.code === 0) {
                messageApi.open({
                    type: 'success',
                    content: res.msg,
                });
                setCommentInput('');
                router.refresh();
            }else{
                messageApi.open({
                    type: 'error',
                    content: res.msg,
                })
            }
        })
    }

    return (
        <div className={styles.enter}>
            {contextHolder}
            <Avatar 
                src={user.avatar} 
                size={40}
            />
            <div className={styles.content}>
                <Input.TextArea
                    placeholder="请输入评论"
                    rows={4}
                    autoSize={{ minRows: 4 }}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                />
                <Button 
                    type='primary'
                    onClick={handleOnComment} 
                    style={{ 
                        marginTop: '20px',
                        alignSelf: 'flex-end',
                     }}   
                >发表评论</Button>
            </div>
        </div>
    );
}