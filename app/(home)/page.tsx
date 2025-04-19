import { getDB } from "@/db";
import { Article } from "@/db/entity";
import ArticlePagination from "@/app/components/articlePagination";


export default async function Page() {
    const myDataSource = await getDB();
    const [articles, count] = await myDataSource
    .getRepository(Article)
    .createQueryBuilder("articles")
    .leftJoinAndSelect("articles.user", "user")
    .getManyAndCount();



    return (
        <div className="content-layout">
            <ArticlePagination articles={JSON.stringify(articles)} count={count} />
        </div>
    );
}