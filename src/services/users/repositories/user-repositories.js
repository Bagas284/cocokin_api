import pool from '../../../database/pool.js';
import { nanoid } from "nanoid";
import bcrypt from 'bcrypt';

class UserRepositories {
    async createUser({ name, email, password }) {
        const id = nanoid(16);
        const profileId = nanoid(16);
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, name, email, hashedPassword, createdAt, updatedAt],
        };
        
        const result = await pool.query(query);

        const profileQuery = {
            text: 'INSERT INTO profiles(id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4)',
            values: [profileId, id, createdAt, updatedAt],
        };

        await pool.query(profileQuery);
        return result.rows[0];
    }

    async updatePassword(userId, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedAt = new Date().toISOString();

        const query = {
            text: 'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING id',
            values: [hashedPassword, updatedAt, userId],
        };

        const result = await pool.query(query);
        return result.rows[0];
    }

    async verifyNewUsername(email) {
        const query = {
            text: 'SELECT email FROM users WHERE email = $1',
            values: [email],
        };
        
        const result = await pool.query(query);
        
        return result.rows.length > 0;
    }

    async verifyUserCredential(email, password) {    
        const query = {
            text: 'SELECT id, password FROM users WHERE email = $1',
            values: [email],
        };
        
        const user = await pool.query(query);
        if (!user) {
            return null;
        }
        
        const { id, password: hashedPassword } = user.rows[0];
        const isPasswordNatch = await bcrypt.compare(password, hashedPassword);
        
        if (!isPasswordNatch) {
            return null;
        }
        return id;
    }

    async getUserByEmail(email) {
        const query = {
            text: 'SELECT id, email FROM users WHERE email = $1',
            values: [email],
        };

        const result = await pool.query(query);

        if (!result.rows.length) {
            return null;
        }

        return result.rows[0];
    }

    async decreaseToken(user_id) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: `
                UPDATE users
                SET analysis_tokens = analysis_tokens - 1, updated_at = $1
                WHERE id = $2
            `,
            values: [updatedAt, user_id]
        };

        await pool.query(query);
    }

    async getUserById(user_id) {
        const query = {
            text: `
                SELECT *
                FROM users
                WHERE id = $1 
            `,
            values: [user_id],
        };

        const result = await pool.query(query);

        if (!result.rows.length) {
            throw new Error('User tidak ditemukan');
        }

        return result.rows[0];
    }

    async activatePremium(user_id) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `
                UPDATE users
                SET
                    subscription_status = 'Premium User',
                    subscription_expired_at = NOW() + INTERVAL '1 month',
                    updated_at = $1
                WHERE id = $2
            `,
            values: [updatedAt, user_id],
        };

        await pool.query(query);
    }

    async downgradeExpiredSubscription(user_id) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `
                UPDATE users
                SET
                    subscription_status = 'Free User',
                    subscription_expired_at = NULL,
                    updated_at = $1
                WHERE id = $2
            `,
            values: [updatedAt, user_id],
        };

        await pool.query(query);
    }
}

export default new UserRepositories();