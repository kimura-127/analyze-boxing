// components/ClickCounterTable.tsx
import { useState } from 'react';
import styles from '../../styles/ClickCounterTable.module.css'; // CSS Moduleのインポート

interface ButtonClickCounterProps {
    jabCount: number;
}

const ClickCounterTable: React.FC<ButtonClickCounterProps> = ({ jabCount }) => {

    return (
        <div className={styles.tableContainer}>
            <table className={styles.clickTable}>
                <thead>
                    <tr>
                        <th>ジャブの回数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{jabCount || 0}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ClickCounterTable;
