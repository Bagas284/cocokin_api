import { Pool } from 'pg';
import { nanoid } from "nanoid";

class DocumentRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async addDocument ({ file_name, file_url, size, mime_type }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO documents(id, file_name, file_url, size, mime_type, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [id, file_name, file_url, size, mime_type, createdAt, updatedAt],
        };

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async getAllDocument() {
        const query = {
            text: 
                `SELECT
                    d.id,
                    d.file_name,
                    d.file_url,
                    d.size,
                    d.mime_type,

                    dp.id AS parsing_id,
                    dp.extracted_text
                FROM documents d
                LEFT JOIN document_parsing dp
                    ON dp.document_id = d.id`}
        const result = await this.pool.query (query);
        return result.rows;
    }
}

export default new DocumentRepositories();