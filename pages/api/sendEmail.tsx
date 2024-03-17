// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async (req: any, res: any) => {
    const { email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yourgmail@gmail.com',
            pass: 'yourpassword', // またはアプリパスワードを使用
        },
    });

    const mailOptions = {
        from: 'yourgmail@gmail.com',
        to: 'destinationemail@example.com',
        subject: 'お問い合わせがありました',
        text: `Email: ${email}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};
