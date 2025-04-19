"use client";

import { useParams  } from "next/navigation";

export default function UserPage(){
    const { id } = useParams();
    return (
        <div className="content-layout">
            <h1>User { id } Page</h1>
        </div>
    );
}