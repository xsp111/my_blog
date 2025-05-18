"use client";

import Listitem from "@/app/_components/Listitem";
import { Divider, Pagination } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPage } from "@/store/modules/paginationStore";
import styles from "./index.module.scss";

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
    const PageSize = 8; // 每页显示的文章数量
    const currentPage = useAppSelector((state) => state.page.currentPage);
    const dispatch = useAppDispatch();
    const articleList: Array<article> = JSON.parse(articles);

    function handleOnChangePage(page: number) {
        dispatch(setPage(page));
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.show}>
                {
                    articleList.slice((currentPage - 1) * PageSize, currentPage * PageSize).map(( article: article ) => 
                        <div key={article.id}>
                            <Listitem article={article}/>
                            <Divider/>
                        </div>
                    )
                }
            </div>
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