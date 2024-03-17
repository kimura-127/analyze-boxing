import React from 'react';
import Image from 'next/image';
import styles from '../../styles/ImageCard.module.css';

interface ImageCardProps {
    src: string;
    alt: string;
    header: string;
    description: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt, header, description }) => {
    return (
        <div className={styles.usecase}>
            <Image className={styles.usecaseImage} src={src} alt={alt} width={250} height={250} />
            <div className={styles.usecaseItem}>
                <h3 className={styles.header}>{header}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
};

export default ImageCard;
