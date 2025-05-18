import { CodeOutlined, FireOutlined, FundViewOutlined } from '@ant-design/icons';
import styles from './index.module.scss'
import Link from 'next/link';
import { Avatar, Divider } from 'antd';
import { getDB } from '@/db';
import { Article, User } from '@/db/entity';
import Listitem from '@/app/_components/Listitem';
import EditInfoButton from '@/app/_components/editUserInfoButton';

export default async function UserPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }){
    const { id } = await params;
    const myDataSource = await getDB();

    // 获取用户以及文章信息
    const user = await myDataSource
    .getRepository(User)
    .createQueryBuilder('users')
    .where('users.id = :id', { id })
    .getOne();

    const articles = await myDataSource
    .getRepository(Article)
    .createQueryBuilder('articles')
    .leftJoinAndSelect('articles.user', 'users')
    .where('articles.user_id = :id', { id })
    .getMany();

    const viewsCount = articles.reduce((total, next) => total + next.views, 0); // 获取文章阅读量

    return (
        <>
            <div className={styles.userDetail}>
              <div className={styles.left}>
                <div className={styles.userInfo}>
                  <Avatar 
                    className={styles.avatar} 
                    size={90}
                    src={user?.avatar}
                  />
                  <div>
                    <div className={styles.nickname}>{user?.nickname}</div>
                    <div className={styles.desc}>
                      <CodeOutlined />{user?.job}
                    </div>
                    <div className={styles.desc}>
                      <FireOutlined />{user?.introduce}
                    </div>
                  </div>
                  <Link href={`/user/${id}/edit`}>
                    <EditInfoButton id={id} />
                  </Link>
                  <div className={styles.right}>
                    <div className={styles.achievement}>
                      <div className={styles.header}>个人成就</div>
                      <div className={styles.number}>
                        <div className={styles.wrapper}>
                          <FundViewOutlined />
                          <span>共创作 { articles.length } 篇文章</span>
                        </div>
                        <div className={styles.wrapper}>
                          <FundViewOutlined />
                          <span>文章被阅读 { viewsCount } 次</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className={styles.article}>
                  {
                    articles?.map((article) => {
                      return (
                        <div key={article.id}>
                          <Listitem article={article} />
                          <Divider />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
        </>
    );
}