import styles from '../../styles/header.module.css'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome } from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import { IconContext } from 'react-icons';





const Header = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

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
                    <IconContext.Provider value={{ size: '1.5rem' }}>
                        <Link href="/">
                            {isMobile ? (
                                <FaHome />
                            ) : (
                                <li className={styles.navItem}>ホーム</li>
                            )}
                        </Link>
                        <Link href="/analyze-video">
                            {isMobile ? (
                                <PiVideoFill />
                            ) : (
                                <li className={styles.navItem}>分析画面</li>
                            )}
                        </Link>
                        <Link href="/contact-form">
                            {isMobile ? (
                                <IoIosMail />
                            ) : (
                                <li className={styles.navItem}>お問い合わせ</li>
                            )}
                        </Link>
                    </IconContext.Provider>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
