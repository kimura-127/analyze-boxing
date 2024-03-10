import Link from 'next/link';
import styles from '../styles/Home.module.css';
import ImageCard from './components/ImageCard';
import { RiBoxingFill } from "react-icons/ri";



const Home = () => {

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.textContainer}>
          <h2>「AI」の力であなたのボクシングを解析</h2>
          <p>AnalyzBoxingはスパーリング・試合<br />の動画を解析することができるアプリです</p>
        </div>
        <h1 className={styles.title}>今すぐ始める</h1>
        <Link href="/analyzeVideo">
          <button className={styles.transferButton}>分析画面</button>
        </Link>
      </main>
      <div className={styles.usecaseContainer}>
        <h2 className={styles.usecaseTitle}>
          <RiBoxingFill />
          AnalyzeBoxingの使い方
        </h2>
        <div className={styles.usecase}>
          <img className={styles.usecaseImage} src="/ImageCard1.jpg" alt="Usecase Image" />
          <div className={styles.usecaseItem}>
            <h3>機能1</h3>
            <p>機能1についての説明。</p>
          </div>
        </div>
      </div>
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