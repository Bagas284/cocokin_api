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
    pgm.createTable('forgot_password', {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        otp: {
            type: 'TEXT',
            notNull: true,
        },
        expired_at: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_used: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        },

        verified_at: {
            type: 'VARCHAR(50)',
            default: null,
        },

        created_at: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('forgot_password');
};
