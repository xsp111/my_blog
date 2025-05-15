'use client';

import { useParams } from "next/navigation";
import { Form, Input, Button } from 'antd';
import styles from './index.module.scss';

export default function UserEdit(){
    const { id } = useParams();
    const [form] = Form.useForm();


    return (
        <div className="content-layout">
            <div className={styles.editArea}>
                <h2>个人资料</h2>
                <Form
                    form={form}
                    name="control-hooks"
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="job" label="职业" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="简介" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            修改
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}