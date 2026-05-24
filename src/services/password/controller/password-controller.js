import PasswordRepositories from "../repositories/password-repositories.js";
import UserRepositories from '../../../services/users/repositories/user-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authorization-error.js';
import { generateOTP } from '../../../utils/generate-otp.js';
import MailSender from '../../../utils/mail-sender.js';
import bcrypt from 'bcrypt';

export const forgotPassword = async(req, res, next) => {
    const { email } = req.validated;

    const user = await UserRepositories.getUserByEmail(email);

    if (!user) {
        return next(new AuthenticationError('Email tidak ditemukan'));
    }

    await PasswordRepositories.deleteOldOTP(user.id);
    const otp = generateOTP();

    const hashedOTP = await bcrypt.hash(otp, 6);

    const expiredAt = new Date(
        Date.now() + 2 * 60 * 1000
    );

    const addOTP = await PasswordRepositories.createOTP({
        userId: user.id,
        otp: hashedOTP,
        expiredAt,
    });

    if(!addOTP) {
        return next(new InvariantError('OTP gagal ditambahkan'));
    }

    await MailSender.sendOTPEmail(email, otp);

    return response(res, 201, 'OTP berhasil dikirim');
}

export const verifyOTP = async(req, res, next) => {
    const { email, otp } = req.validated;

    const user = await UserRepositories.getUserByEmail(email);

    if (!user) {
        return next(new AuthenticationError('Email tidak ditemukan'));
    }

    const otpData =await PasswordRepositories.getOTPByUserId(user.id);

    if (!otpData) {
        return next(new AuthenticationError('OTP tidak ditemukan'));
    }

    const match = await bcrypt.compare(
        otp,
        otpData.otp
    );

    if (!match) {
        return next(new AuthenticationError('OTP salah'));
    }

    if(otpData.is_used) {
        return next(new AuthenticationError('OTP sudah digunakan'));
    }

    if (new Date() > new Date(otpData.expired_at)) {
        return next(new AuthenticationError('OTP sudah kadaluarsa'));
    }

    await PasswordRepositories.verifyOTP(otpData.id);

    return response(res, 200, 'OTP berhasil diverifikasi');
};

export const resetPassword = async(req, res, next) => {
    const { email, password } = req.validated;

    const user = await UserRepositories.getUserByEmail(email);

    if (!user) {
        return next(new AuthenticationError('Email tidak ditemukan'));
    }

    const verifiedOTP = await PasswordRepositories.getVerifiedOTP(user.id);

    if(!verifiedOTP) {
        return next(new AuthenticationError('OTP belum diverifikasi'));
    }

    const updatePassword = await UserRepositories.updatePassword(user.id, password);

    if(!updatePassword) {
        return next(new InvariantError('Password gagal diperbarui'));
    }

    await PasswordRepositories.deleteOldOTP(user.id);

    return response(res, 200, 'Password berhasil diperbarui');
}