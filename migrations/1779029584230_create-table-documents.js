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
    pgm.createTable('documents', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        file_name: {
            type: 'TEXT',
            notNull: true,
        },
        file_url: {
            type: 'TEXT',
            notNull: true,
        },
        size: {
            type: 'INT',
            notNull: true
        },
        mime_type: {
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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('documents');
};
