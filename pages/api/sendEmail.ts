import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function sendGmail(req: NextApiRequest, res: NextApiResponse) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.GMAILUSER,
            pass: process.env.GMAILPASSWORD,
        },
    });

    const toHostMailData = {
        from: req.body.email,
        to: "kimuraramuki127@gmail.com",
        sugject: `[お問い合わせ] ${req.body.name}様より`,
        text: `${req.body.message} Send from ${req.body.email}`,
        html: `
            <p> 【名前】</p>
            <p> ${req.body.name}</p>
            <p> 【メッセージ内容】</p>
            <p> ${req.body.message}</p>
            <p> 【メールアドレス】</p>
            <p> ${req.body.email}</p>
        `
    }

    try {
        await transporter.sendMail(toHostMailData);
        res.status(200).send({ message: 'メールが送信されました！' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'メールの送信に失敗しました。' });
    }

};
