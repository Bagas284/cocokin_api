import pool from '../../../database/pool.js';
import { nanoid } from 'nanoid';
 
class AuthenticationRepositories {
    async addRefreshToken(token) {    
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO authentications VALUES($1, $2)',
            values: [id, token],
        };
        
        await pool.query(query);
    }

    async deleteRefreshToken(token) {
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        };
        await pool.query(query);
    }

    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };

        const result = await pool.query(query);
        if (!result.rows.length) {
            return false;
        }

        return result.rows[0];
    }
}
 
export default new AuthenticationRepositories();