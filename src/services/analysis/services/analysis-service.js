import axios from 'axios';
import FormData from 'form-data';

export const analyzeCV = async(file, target_role) => {
  const formData = new FormData();

  formData.append(
    'file',
    file.buffer,
    file.originalname
  );

  const endpoint = target_role
    ? `${process.env.AI_API}/analyze-target-role?target_role=${target_role}`
    : `${process.env.AI_API}/recommend-from-cv`;

  const { data } = await axios.post(
    endpoint,
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  return data;
};

export const mapAnalysisData = (docId, aiResult) => ({
  documentId: docId,
  fileName: aiResult.filename,
  extractText: aiResult.extracted_text_preview,
  targetRole: aiResult.target_role,

  industry_sector_cand:
    aiResult.extracted_profile?.industry_sector_cand || null,

  cand_tech_skills: JSON.stringify(
    aiResult.extracted_profile?.cand_tech_skills || []
  ),

  cand_soft_skills: JSON.stringify(
    aiResult.extracted_profile?.cand_soft_skills || []
  ),

  experience_years:
    aiResult.extracted_profile?.experience_years || 0,

  education_level_cand:
    aiResult.extracted_profile?.education_level_cand || null,

  match_score_percent:
    aiResult.match_score_percent || null,

  fit_category:
    aiResult.fit_category || null,

  reasoning:
    aiResult.reasoning || null,

  experience_gap_years:
    aiResult.experience_gap_years || null,

  edu_gap:
    aiResult.edu_gap || 0,

  matched_skills: JSON.stringify(
    aiResult.matched_skills || []
  ),

  missing_skills: JSON.stringify(
    aiResult.missing_skills || []
  ),

  recommendations: JSON.stringify(
    aiResult.similar_jobs ||
    aiResult.top_recommendations ||
    []
  ),
});