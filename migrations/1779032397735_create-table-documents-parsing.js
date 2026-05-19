/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('document_parsing', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        document_id: {
            type: 'VARCHAR(50)',
            unique: true,
            notNull: true,
        },
        extracted_text: {
            type: 'TEXT',
            notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.addConstraint('document_parsing', 'unique_document_parsing', 'UNIQUE(document_id)');
    pgm.addConstraint(
        'document_parsing',
        'fk_document_parsing.document_id_documents.id',
        'FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE'
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('document_parsing');
};
