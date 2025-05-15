"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Input, Select } from "antd";
import { message } from "antd";
import request from "@/app/util/fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@/db/entity";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: true }
);

export default function ModifyEditor() {
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // 获取文章id
    const id = Number(useSearchParams().get("id"));
    // 获取文章信息和标签
    useEffect(() => {
        request.get('/api/tag/get')
        .then((res) => {
            if(res.code === 0) {
              setAllTags(res.data.allTags);
            }
        });
        request.get(`/api/article/update`, {
            params: {
                id
            }
        })
        .then((res) => {
            if(res.code === 0){
                setSelectedTags(res.data.tags.map((tag: Tag) => tag.id)); // 设置选中的标签
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


    // 选择标签
    function handleChange(value: number[]) {
        setSelectedTags(value);
    }

    function handleOnChange(value?: string) {
        if(value) {
            setContent(value);
        }
    }

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
                content,
                selectedTags
            }).then((res) => {
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
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '15%' }}
                    placeholder="请选择标签"
                    value={selectedTags}
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
                    onClick={handleOnModify}
                >修改文章</Button>
            </div>
            <MDEditor 
                value={content}
                height={1080}
                onChange={handleOnChange} 
            />
        </div>
    );
}