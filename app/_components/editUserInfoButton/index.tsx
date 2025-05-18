'use client';

import { useAppSelector } from "@/store/hooks";
import { Button } from "antd";

export default function EditInfoButton({ id }: { id: string }){
    const user = useAppSelector((state) => state.user);
    return (
        user.id == Number(id) && (
            <Button>
                编辑个人资料
            </Button>
        )
    );
}