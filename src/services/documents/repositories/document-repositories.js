import pool from '../../../database/pool.js';
import { nanoid } from "nanoid";

class DocumentRepositories {
    async addDocument ({ file_name, file_url, size, mime_type, target_role, user_id }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `
            INSERT INTO documents(
                id, 
                file_name, 
                file_url, 
                size, 
                mime_type, 
                target_role, 
                created_at, 
                updated_at, 
                user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            values: [id, file_name, file_url, size, mime_type, target_role, createdAt, updatedAt, user_id],
        };

        const result = await pool.query(query);
        return result.rows[0];
    }

    async getAllDocument(user_id) {
        const query = {
            text: 
                `SELECT
                    d.id,
                    d.file_name,
                    d.file_url,
                    d.size,
                    d.mime_type,
                    d.target_role,

                    dp.id AS parsing_id,
                    dp.extracted_text
                FROM documents d
                LEFT JOIN document_parsing dp
                    ON dp.document_id = d.id
                WHERE d.user_id = $1`,
            values: [user_id]
            }
        const result = await pool.query (query);
        return result.rows;
    }
}

export default new DocumentRepositories();