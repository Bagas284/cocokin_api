import { Pool } from "pg";
import { nanoid } from "nanoid";
import bcrypt from 'bcrypt';

class UserRepositories {
    constructor() {
        this.pool = new Pool();
    }

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
        
        const result = await this.pool.query(query);

        const profileQuery = {
            text: 'INSERT INTO profiles(id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4)',
            values: [profileId, id, createdAt, updatedAt],
        };

        await this.pool.query(profileQuery);
        return result.rows[0];
    }

    async verifyNewUsername(email) {
        const query = {
            text: 'SELECT email FROM users WHERE email = $1',
            values: [email],
        };
        
        const result = await this.pool.query(query);
        
        return result.rows.length > 0;
    }

    async verifyUserCredential(email, password) {    
        const query = {
            text: 'SELECT id, password FROM users WHERE email = $1',
            values: [email],
        };
        
        const user = await this.pool.query(query);
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
}

export default new UserRepositories();