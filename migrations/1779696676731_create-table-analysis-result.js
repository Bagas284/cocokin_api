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
    pgm.createTable('analysis_results', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        document_id: {
            type: 'VARCHAR(50)',
            references: 'documents(id)',
            onDelete: 'CASCADE',
            notNull: true,
        },
        filename: {
            type:'TEXT',
            notNull: true,
        },
        extracted_text_preview: {
            type: 'TEXT',
            notNull: false
        },
        target_role: {
            type: 'TEXT',
            notNull: false,
        },
        candidate_name: {
            type: 'TEXT',
            notNull: false,
        },
        industry_sector_cand: {
            type: 'TEXT',
            notNull: false,
        },
        cand_tech_skills: {
            type: 'JSONB',
            notNull: false,
        },
        cand_soft_skills: {
            type: 'JSONB',
            notNull: false,
        },
        experience_years: {
            type: 'FLOAT',
            notNull: false,
        },
        education_level_cand: {
            type: 'VARCHAR(100)',
            notNull: false,
        },
        match_score_percent: {
            type: 'FLOAT',
            notNull: false,
        },
        fit_category: {
            type: 'TEXT',
            notNull: false,
        },
        reasoning: {
            type: 'TEXT',
            notNull: false,
        },
        experience_gap_years: {
            type: 'FLOAT',
            notNull: false,
        },
        edu_gap: {
            type: 'FLOAT',
            notNull: false,
        },
        matched_skills: {
            type: 'JSONB',
            notNull: false,
        },
        missing_skills: {
            type: 'JSONB',
            notNull: false,
        },
        recommendations: {
            type: 'JSONB',
            notNull: false,
        },
        created_at: {
            type: 'TEXT',
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
    pgm.dropTable('analysis_results');
};
