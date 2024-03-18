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
        <Link href="/AnalyzeVideo">
          <button className={styles.transferButton}>分析画面</button>
        </Link>
      </main>
      <div className={styles.usecaseContainer}>
        <h2 className={styles.usecaseTitle}>
          <RiBoxingFill />
          AnalyzeBoxingの使い方
        </h2>
        <ImageCard src="/ImageCard1.jpg" alt="Usecase Image" header="対戦の様子を撮影" description="自分の試合・スパーリングの様子を撮影" />
        <ImageCard src="/ImageCard2.jpg" alt="Usecase Image" header="自分か相手かAIに学習" description="AIに自分と対戦相手を学習させる" />
        <ImageCard src="/ImageCard3.jpg" alt="Usecase Image" header="リアルタイムで分析処理" description="AnalyzeBoxingを用いて動画を分析" />
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link href="/TermsOfService" className={styles.footerLink}>
            利用規約
          </Link>
          <Link href="/privacypolicy" className={styles.footerLink}>
            プライバシーポリシー
          </Link>
        </div>
        <p>Copyright © 2024 - All right reserved by AnalyzeBoxing</p>
      </footer>
    </div>
  );
};

export default Home;