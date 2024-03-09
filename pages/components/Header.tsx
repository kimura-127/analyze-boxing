import styles from '../../styles/header.module.css'

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src="/favicon.ico" alt="logo" className={styles.logo} />
                <span className={styles.appName}>AnalyzeBoxing</span>
            </div>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>ホーム</li>
                    <li className={styles.navItem}>セクション1</li>
                    <li className={styles.navItem}>セクション2</li>
                    <li className={styles.navItem}>お問い合わせ</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
