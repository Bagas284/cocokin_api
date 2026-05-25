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
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
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
                    d.target_role
                FROM documents d
                WHERE d.user_id = $1`,
            values: [user_id]
            }
        const result = await pool.query (query);
        return result.rows;
    }

    async verifyDocumentOwner(documentId, user_id) {
        const query = {
            text: `
                SELECT *
                FROM documents
                WHERE id = $1
            `,
            values: [documentId],
        };

        const result = await pool.query(query);

        if (!result.rows.length) {
            return null; // document benar-benar tidak ada
        }

        const document = result.rows[0];

        if (document.user_id !== user_id) {
            return false; // document ada tapi bukan pemilik
        }

        return document;
    }

    async getDocumentById(id) {
        const query = {
            text: 'SELECT * FROM documents WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows[0];
    }
}

export default new DocumentRepositories();