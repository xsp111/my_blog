"use client";

import { useState } from "react";
import Listitem from "@/app/components/Listitem";
import { Divider, Pagination } from "antd";

export type article = {
    id: number,
    title: string,
    content: string,
    update_time: Date,
    create_time: Date,
    views: number,
    is_deleted: number,
    user: {
        id: number,
        nickname: string,
        avatar: string,
    }
}

export default function ArticlePagination({ count, articles }: { count: number, articles: string }) {
    const PageSize = 6; // 每页显示的文章数量
    const [currentPage, setCurrentPage] = useState(2); // 当前页码
    const articleList: Array<article> = JSON.parse(articles);

    function handleOnChangePage(page: number) {
        console.log(page);
        setCurrentPage(page);
    }

    return (
        <div>
            {
                articleList.slice((currentPage - 1) * PageSize, currentPage * PageSize).map(( article: article ) => 
                    <div key={article.id}>
                        <Listitem article={article}/>
                        <Divider />
                    </div>
                )
            }
            <Pagination 
                defaultPageSize={PageSize}
                defaultCurrent={currentPage} 
                total={count}
                // 改变页面
                onChange={handleOnChangePage}
                style={{
                    marginTop: '20px',
                    justifyContent: 'center',
                }} 
            />
        </div>
    );
}