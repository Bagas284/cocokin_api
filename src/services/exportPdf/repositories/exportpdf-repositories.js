import pool from '../../../database/pool.js';

class ExportPdfRepositories {
    async createPdf(id) {
        const query = {
            text: `
                SELECT
                    u.name,
                    a.filename,
                    json_build_object(
                        'industry_sector_cand', a.industry_sector_cand,
                        'cand_tech_skills', a.cand_tech_skills,
                        'cand_soft_skills', a.cand_soft_skills,
                        'experience_years', a.experience_years,
                        'education_level_cand', a.education_level_cand
                    ) AS extracted_profile,
                    a.extracted_text_preview,
                    a.target_role,
                    a.match_score_percent,
                    a.fit_category,
                    a.missing_skills,
                    a.matched_skills,
                    a.experience_gap_years,
                    a.edu_gap,
                    a.reasoning,
                    a.recommendations,
                    a.created_at
                FROM analysis_results a
                JOIN documents d
                    ON a.document_id = d.id
                JOIN users u
                    ON d.user_id = u.id

                WHERE a.id = $1
            `,
            values: [id],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }
}

export default new ExportPdfRepositories();