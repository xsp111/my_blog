"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Button, Input, Select } from "antd";
import { message } from "antd";
import request from "@/app/util/fetch";
import { useRouter } from "next/navigation";
import { Tag } from "@/db/entity";


const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function NewEditor() {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("**Hello world!!!**");

    useEffect(() => {
        request.get('/api/tag/get').then((res) => {
            if(res.code === 0) {
              setAllTags(res.data.allTags);
            }
        })
    }, []);

    // 编辑器内容改变
    function handleOnChange(value?: string) {
        if(value) {
            setContent(value);
        }
    }

    // 选择标签
    function handleChange(value: number[]) {
        setSelectedTags(value);
    }

    // 发布文章
    function handleOnPublish() {
        if(!title) {
            messageApi.open({
                type: 'error',
                content: '请输入文章标题',
            });
        } else if(selectedTags.length === 0) {
            messageApi.open({
                type: 'error',
                content: '请选择标签',
            });
        } else {
            request.post('/api/article/publish', {
                title,
                content,
                selectedTags
            }).then((res) => {
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
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '15%' }}
                    placeholder="请选择标签"
                    onChange={handleChange}
                    options={allTags.map((tag) => {
                        return {
                            label: tag.title,
                            value: tag.id,
                        }
                    })}
                />
                <Button 
                    type="primary"
                    onClick={handleOnPublish}
                >发布文章</Button>
            </div>
            <MDEditor 
                value={content}
                height={1080}
                onChange={handleOnChange} 
            />
        </div>
    );
}