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
            RETURNING id`, 
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
}

export default new AnalysisRepositories();