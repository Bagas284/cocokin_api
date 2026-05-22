import pool from '../../../database/pool.js';
import { nanoid } from 'nanoid';

class DocumentParsingRepositories {
    async addParsing({ document_id, extracted_text }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `
                INSERT INTO document_parsing
                    (id, document_id, extracted_text, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `,
            values: [
                id, document_id, extracted_text, createdAt, updatedAt
            ],
        };

        const result = await pool.query(query);
        return result.rows[0];
    }
}

export default new DocumentParsingRepositories();