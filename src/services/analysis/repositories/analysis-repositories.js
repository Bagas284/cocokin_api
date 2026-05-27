import pool from '../../../database/pool.js';
import { nanoid } from "nanoid";

class AnalysisRepositories{
    async addAnalysis({ 
        documentId, 
        fileName, 
        extractText, 
        targetRole, 
        industry_sector_cand, 
        cand_tech_skills,
        cand_soft_skills,
        experience_years,
        education_level_cand,
        match_score_percent,
        fit_category,
        reasoning,
        experience_gap_years,
        edu_gap,
        matched_skills,
        missing_skills,
        recommendations
    }){
        const id = nanoid(16);
        const createdAt = new Date().toISOString();

        const query = {
            text: `
            INSERT INTO analysis_results(
                id, 
                document_id, 
                filename, 
                extracted_text_preview, 
                target_role, 
                industry_sector_cand,
                cand_tech_skills,
                cand_soft_skills, 
                experience_years,
                education_level_cand,
                match_score_percent,
                fit_category,
                reasoning,
                experience_gap_years,
                edu_gap,
                matched_skills,
                missing_skills,
                recommendations,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
            RETURNING *`, 
            values: [
                id, 
                documentId, 
                fileName, 
                extractText, 
                targetRole, 
                industry_sector_cand, 
                cand_tech_skills, 
                cand_soft_skills, 
                experience_years, 
                education_level_cand, 
                match_score_percent, 
                fit_category, 
                reasoning,
                experience_gap_years,
                edu_gap,
                matched_skills,
                missing_skills,
                recommendations,
                createdAt
            ]
        };

        const result = await pool.query(query);
        return result.rows[0];
    }

    async getAllAnalysis(user_id, keyword = '') {
        const query = {
            text: `
                SELECT 
                    a.id,
                    a.document_id,
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
                WHERE d.user_id = $1
                AND (
                    $2 = ''
                    OR a.filename ILIKE $3
                    OR a.target_role ILIKE $3
                )
                ORDER BY a.created_at DESC
            `,
            values: [user_id, keyword, `%${keyword}%`],
        };

        const result = await pool.query(query);
        return result.rows;
    }

    async getAnalysisById(id) {
        const query = {
            text: `
                SELECT
                    a.id,
                    a.document_id,
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
                WHERE a.id = $1
            `,
            values: [id],
        }

        const result = await pool.query(query);
        return result.rows[0];
    }

    async verifyAnalysisOwner(id, user_id) {
        const query = {
            text: `
                SELECT * FROM analysis_results a
                JOIN documents d
                    ON a.document_id = d.id
                WHERE a.id = $1
            `,
            values: [id],
        }

        const result = await pool.query(query);

        if (!result.rows.length) {
            return null; // analysis benar-benar tidak ada
        }

        const analysis = result.rows[0];

        if (analysis.user_id !== user_id) {
            return false; // analysis ada tapi bukan pemilik
        }

        return analysis;
    }
}

export default new AnalysisRepositories();