import nodemailer from 'nodemailer';

class MailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendOTPEmail(email, otp) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP Reset Password',
            text: `Kode OTP kamu adalah ${otp}`,
        });
    }
}

export default new MailSender();