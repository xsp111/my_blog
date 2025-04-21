"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "./index.module.scss";
import { Button, Input } from "antd";
import { message } from "antd";
import request from "@/app/util/fetch";
import { useRouter } from "next/navigation";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function NewEditor() {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("**Hello world!!!**");

    // 发布文章
    function handleOnPublish() {
        if(!title) {
            messageApi.open({
                type: 'error',
                content: '请输入文章标题',
            });
        } else {
            request.post('/api/article/publish', {
                title,
                content
            }).then((res: any) => {
                if(res.code === 0){
                    messageApi.open({
                        type: 'success',
                        content: '发布成功',
                    });
                    // 跳转到主页
                    setTimeout(() => {
                        router.push(`/user/${res.data.user_id}`);
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
                    onClick={handleOnPublish}
                >发布文章</Button>
            </div>
            <MDEditor 
                value={content}
                height={1080}
                onChange={setContent} 
            />
        </div>
    );
}