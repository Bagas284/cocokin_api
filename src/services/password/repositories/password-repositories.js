import pool from '../../../database/pool.js';
import { nanoid } from 'nanoid';

class PasswordRepositories {
    async createOTP({ userId, otp, expiredAt}) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO forgot_password(id, user_id, otp, expired_at, created_at) VALUES($1,$2, $3, $4, $5) RETURNING id',
            values: [id, userId, otp, expiredAt, createdAt],
        }

        const result = await pool.query(query);
        return result.rows[0];
    }

    async deleteOldOTP(userId) {
        const query = {
            text: 'DELETE FROM forgot_password WHERE user_id = $1',
            values: [userId],
        };

        await pool.query(query);
    }

    async getOTPByUserId(userId){
        const query = {
            text: 'SELECT * FROM forgot_password WHERE user_id = $1',
            values: [userId],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }

    async verifyOTP(id){
        const verivedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE forgot_password SET is_used = true, verified_at = $1 WHERE id =$2',
            values: [verivedAt, id],
        };

        await pool.query(query);
    }

    async getVerifiedOTP(userId) {
        const query = {
            text: 'SELECT * FROM forgot_password WHERE user_id = $1 AND is_used = true',
            values: [userId],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }
}

export default new PasswordRepositories();