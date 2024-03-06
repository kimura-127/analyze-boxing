import Link from 'next/link';
import styles from '../styles/Home.module.css';
import ImageCard from './components/ImageCard';


const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>ホーム</li>
            <li className={styles.navItem}>セクション1</li>
            <li className={styles.navItem}>セクション2</li>
            <li className={styles.navItem}>お問い合わせ</li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>チャットボード</h1>
        <div className={styles.cardContainer}>
          {/* カードコンポーネント */}
        </div>
        {/* Linkコンポーネントの使用例 */}
        <Link href="/analyzeVideo">
          <button className={styles.transferButton}>転移ボタン</button>
        </Link>
      </main>
      <div className={styles.imageContainer}>
        <ImageCard
          src="/ImageCard1.jpg"
          alt="First image description"
          description="ここには最初の画像の説明が入ります。"
        />
        <ImageCard
          src="/ImageCard2.jpg"
          alt="Second image description"
          description="ここには2番目の画像の説明が入ります。"
        />
        <ImageCard
          src="/ImageCard3.jpg"
          alt="Third image description"
          description="ここには3番目の画像の説明が入ります。"
        />
      </div>
    </div>
  );
};

export default Home;