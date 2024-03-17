// components/ProgressBar.tsx
import React, { FC } from 'react';
import styles from '../../styles/progressBar.module.css';

interface ProgressBarProps {
    progress: number; // 0 から 100 の値
}

const ProgressBar: FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            <span className={styles.progressBarText}>{progress}%</span>
        </div>
    );
};

export default ProgressBar;
