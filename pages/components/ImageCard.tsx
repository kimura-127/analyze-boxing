// components/ImageCard.tsx
import React from 'react';
import styles from '../../styles/ImageCard.module.css'; // スタイルを適用するために別途CSSファイルを作成すること

interface ImageCardProps {
    src: string;
    alt: string;
    description: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt, description }) => {
    return (
        <div className={styles.card}>
            <img src={src} alt={alt} className={styles.image} />
            <p className={styles.description}>{description}</p>
        </div>
    );
};

export default ImageCard;
