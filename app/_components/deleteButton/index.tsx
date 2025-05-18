'use client';

import request from "@/app/util/fetch";
import { message } from 'antd';
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    function handleOnDelete() {
        request.post('/api/article/delete', {
            id
        })
        .then(res => {
            if (res.code === 0) {
                messageApi.open({
                    type: 'success',
                    content: res.msg,
                });
                setTimeout(() => {
                    router.push('/');
                }, 500);
            } else {
                messageApi.open({
                    type: 'error',
                    content: res.msg,
                });
            }
        })
    }

    return (
        <>
            {contextHolder}
            <div
                style={{
                    color: 'red',
                    cursor: 'pointer',
                }}
                onClick={handleOnDelete}
            >
            删除
        </div>
        </>
    );
}