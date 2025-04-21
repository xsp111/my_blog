"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input } from "antd";
import { message } from "antd";
import request from "@/app/util/fetch";
import { useRouter, useSearchParams } from "next/navigation";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: true }
);

export default function ModifyEditor() {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // 获取文章id
    const id = Number(useSearchParams().get("id"));
    // 获取文章信息
    useEffect(() => {
        request.get(`/api/article/update`, {
            params: {
                id
            }
        })
        .then((res: any) => {
            if(res.code === 0){
                setTitle(res.data.title);
                setContent(res.data.content);
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.msg,
                });
            }
        })
    }, [id, messageApi]);

    // 发布文章
    function handleOnModify() {
        if(!title) {
            messageApi.open({
                type: 'error',
                content: '请输入文章标题',
            });
        } else {
            request.post('/api/article/update', {
                id,
                title,
                content
            }).then((res: any) => {
                if(res.code === 0){
                    messageApi.open({
                        type: 'success',
                        content: '修改成功',
                    });
                    // 跳转到主页
                    setTimeout(() => {
                        router.push(`/article/${id}`);
                    }, 300);
                }else{
                    messageApi.open({
                        type: 'error',
                        content: res.msg,
                    });
                }
            })
        }
    }

    return (
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.operationArea}>
                <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入文章标题" 
                />
                <Button 
                    type="primary"
                    onClick={handleOnModify}
                >修改文章</Button>
            </div>
            <MDEditor 
                value={content}
                height={1080}
                onChange={setContent} 
            />
        </div>
    );
}