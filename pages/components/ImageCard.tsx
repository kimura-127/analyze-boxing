// components/ImageCard.tsx
import React from 'react';
import styles from '../../styles/ImageCard.module.css'; // スタイルを適用するために別途CSSファイルを作成すること

interface ImageCardProps {
    src: string;
    alt: string;
    header: string;
    description: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt, header, description }) => {
    return (
        <div className={styles.usecase}>
            <img className={styles.usecaseImage} src={src} alt={alt} />
            <div className={styles.usecaseItem}>
                <h3 className={styles.header}>{header}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
};

export default ImageCard;
