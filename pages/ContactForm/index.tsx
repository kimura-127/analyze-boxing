import React, { useState } from 'react';
import styles from '../../styles/contactForm.module.css';



const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, message }),
        });
        if (response.ok) {
            alert('メールが送信されました！');
            setEmail('');
            setMessage('');
        } else {
            alert('メールの送信に失敗しました。');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h1 style={{ color: '#fff', textAlign: 'center' }}>お問い合わせ</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>名前</label>
                    <input
                        type="text"
                        id="name"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>メールアドレス</label>
                    <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="message" className={styles.label}>お問い合わせ内容</label>
                    <textarea
                        id="message"
                        className={styles.textarea}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.button}>送信</button>
            </form>
        </div>
    );
};

export default ContactForm;
