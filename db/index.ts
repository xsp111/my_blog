import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, UserAuth, Article, Comment } from "./entity/index";

const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "alitazzl2019",
    database: "my_blog",
    entities: [ User, UserAuth, Article, Comment ],
    synchronize: false,
    logging: true,
});

export async function getDB() {
    if (!myDataSource.isInitialized) {
        await myDataSource.initialize();
    }
    return myDataSource;
}