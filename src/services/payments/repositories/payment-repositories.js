import { nanoid } from "nanoid";
import pool from '../../../database/pool.js';

class PaymentRepositories {
    async createPayment(user_id){
        const id = nanoid(16);
        const orderId = `ORDER-${Date.now()}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `
                INSERT INTO payments(
                    id,
                    user_id,
                    order_id,
                    amount,
                    payment_status,
                    created_at,
                    updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `,
            values: [id, user_id, orderId, 89000, 'Pending', createdAt, updatedAt],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }

    async markAsPaid(user_id) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `
                UPDATE payments
                SET payment_status = 'Paid', updated_at = $1
                WHERE user_id = $2
                RETURNING *
            `,
            values: [updatedAt, user_id],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }
}

export default new PaymentRepositories();