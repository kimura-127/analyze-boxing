import styles from '../../styles/header.module.css'
import Link from 'next/link';

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href="/">
                <div className={styles.logoContainer}>
                    <img src="/favicon.ico" alt="logo" className={styles.logo} />
                    <span className={styles.appName}>AnalyzeBoxing</span>
                </div>
            </Link>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <Link href="/">
                        <li className={styles.navItem}>ホーム</li>
                    </Link>
                    <Link href="/analyzevideo">
                        <li className={styles.navItem}>分析画面</li>
                    </Link>
                    <Link href="/contactform">
                        <li className={styles.navItem}>お問い合わせ</li>
                    </Link>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
