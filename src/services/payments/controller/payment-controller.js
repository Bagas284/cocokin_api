import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import PaymentRepositories from '../repositories/payment-repositories.js';
import UserRepositories from '../../users/repositories/user-repositories.js';

export const createPayment = async(req, res, next) => {
    const { id: user_id } = req.user;

    const payment = await PaymentRepositories.createPayment(user_id);

    if (!payment) {
      return next(new InvariantError('Payment gagal dibuat'));
    }

    return response(res, 201, 'Payment berhasil dibuat', { payment });
}

export const paymentSuccess = async(req, res, next)  => {
    const { id: user_id } = req.user;

    const payment = await PaymentRepositories.markAsPaid(user_id);

    if (!payment) {
      return next(new InvariantError('Payment gagal'));
    }

    await UserRepositories.activatePremium(user_id);

    return response(res, 201, 'Premium berhasil diaktifkan');
}