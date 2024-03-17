// components/TermsOfService.tsx
import React from 'react';
import styles from '../../styles/termsOfService.module.css';

const TermsOfService = () => {
    return (
        <div className={styles.termsContainer}>
            <h1 className={styles.termsTitle}>プライバシーポリシー</h1>
            <section className={styles.termsSection}>
                <h2 className={styles.termsHeading}>はじめに</h2>
                <p>AnalyzeBoxing（以下、「当社」とします）は、当社が運営するWebサービス（以下、「本サービス」とします）において、お客様のプライバシーを尊重し、お客様から提供される個人情報の保護に努めています。本プライバシーポリシーは、本サービスを利用される際に、当社がどのような情報を収集し、その情報をどのように扱うかについて説明しています。</p>

                <h2 className={styles.termsHeading}>収集する情報</h2>
                <p>当社は、本サービスの提供、改善、お客様のサポートのために、以下の情報を収集することがあります。<br />
                    ・動画<br />
                    ・Cookieを用いて生成された識別情報<br />
                    ・OSが生成するID、端末の種類、端末識別子等のお客様が利用するOSや端末に関する情報<br />
                    ・当社ウェブサイトの滞在時間、入力履歴、購買履歴等の当社ウェブサイトにおけるお客様の行動履歴<br />
                    ・当社アプリの起動時間、入力履歴、購買履歴等の当社アプリの利用履歴</p>

                <h2 className={styles.termsHeading}>利用目的</h2>
                <p>収集した情報は、以下の目的で利用されます。 <br />
                    ・本サービスの提供と運営<br />
                    ・お客様からのお問い合わせへの対応<br />
                    ・本サービスの改善と開発<br />
                    ・新サービスの案内や更新情報の提供<br />
                    ・不正アクセスや不正利用の防止</p>
                <h2 className={styles.termsHeading}>第三者への提供</h2>
                <p>当社は、法律に基づく場合やお客様の同意がある場合を除き、お客様の個人情報を第三者に提供することはありません。ただし、Google Analyticsのような第三者サービスを利用しており、これらのサービス提供者がデータを収集・分析する場合があります。</p>
                <h2 className={styles.termsHeading}></h2>
                <p>お客様からの個人情報に関するお問い合わせは、以下のメールアドレスまでお願いいたします。 <br />
                    Email: kimuraramuki127@gmail.com
                </p>
                <h2 className={styles.termsHeading}>改訂</h2>
                <p>本プライバシーポリシーは、法令の変更や本サービスの変更に応じて、必要に応じて改訂されることがあります。改訂された場合は、本サービス上で適切にお知らせします。</p>
            </section>
            <p className={styles.effectiveDate}>制定日：2024年3月18日</p>
        </div>
    );
};

export default TermsOfService;
