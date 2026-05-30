import PDFDocument from 'pdfkit';

const generatePdfBuffer = async (analysis) => {
    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({
            margin: 60,
            size: 'A4',
        });

        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));

        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        doc.on('error', reject);

        // Header
        doc
            .fontSize(30)
            .text('Analysis Report', {
                align: 'center',
            });

        doc.moveDown();

        doc.fontSize(13);

        doc.text(`Nama User : ${analysis.name}`);
        doc.text(`Filename : ${analysis.filename}`);
        if (!analysis.target_role && !analysis.match_score_percent && !analysis.fit_category){
            doc.text(`Target Role : -`);
            doc.text(`Match Score : -`);
            doc.text(`Fit Category : -`);
        } else {
            doc.text(`Target Role : ${analysis.target_role}`);
            doc.text(`Match Score : ${analysis.match_score_percent}%`);
            doc.text(`Fit Category : ${analysis.fit_category}`);
        }

        doc.moveDown();

        // Extracted Profile
        doc.fontSize(17).text('Extracted Profile');
        doc.moveDown(0.5);
        doc.fontSize(13);
        if(analysis.extracted_profile.candidate_name === null) {
            doc.text(`Candidate Name : -`);
        } else {
            doc.text(`Candidate Name : ${analysis.extracted_profile.candidate_name}`);
        }
        doc.text(`Industry Sector : ${analysis.extracted_profile.industry_sector_cand}`);
        doc.text(`Experience Years : ${analysis.extracted_profile.experience_years}`);
        doc.text(`Education Level : ${analysis.extracted_profile.education_level_cand}`);
        doc.text('Tech Skills: ');
        analysis.extracted_profile.cand_tech_skills.forEach((skill) => {
            doc.text(`• ${skill}`, {
                indent: 20,
            });
        });
        doc.text('Soft Skills: ');
        analysis.extracted_profile.cand_soft_skills.forEach((skill) => {
            doc.text(`• ${skill}`, {
                indent: 20,
            });
        });

        doc.moveDown();

        //Extrac text
        doc.fontSize(17).text('Extracted Text');
        doc.moveDown(0.5);
        if(!analysis.extracted_text_preview){
            doc.fontSize(13).text(
                '-',
                {
                    align: 'justify',
                }
            );
        } else {
            doc.fontSize(13).text(
                analysis.extracted_text_preview,
                {
                    align: 'justify',
                }
            );
        }

        doc.moveDown();

        //Mising Skill
        doc.fontSize(17).text('Missing Skills');
        doc.moveDown(0.5);
        if(analysis.missing_skills.length === 0) {
            doc.text('-');
        } else {
            analysis.missing_skills.forEach((skill) => {
                doc.fontSize(13).text(`• ${skill}`, {
                    indent: 20,
                });
            });
        }
        
        doc.moveDown();

        //Matched Skill
        doc.fontSize(17).text('Matched Skills');
        doc.moveDown(0.5);
        if(analysis.matched_skills.length === 0){
            doc.text('-');
        } else {
            analysis.matched_skills.forEach((skill) => {
                doc.fontSize(13).text(`• ${skill}`, {
                    indent: 20,
                });
            });
        }

        doc.moveDown();

        //Experience Gap Year
        doc.fontSize(17).text('Experience Gap Years');
        doc.moveDown(0.5);
        doc.fontSize(13);
        if(!analysis.experience_gap_years){
            doc.text(`Experience Gap Years : -`);
        } else {
            doc.text(`Experience Gap Years : ${analysis.experience_gap_years}`);
        }
        
        doc.moveDown();

        //Edu Gap
        doc.fontSize(17).text('Edu Gap');
        doc.moveDown(0.5);
        doc.fontSize(13);
        doc.text(`Edu Gap : ${analysis.edu_gap}`);

        doc.moveDown();

        //Reasoning
         doc.fontSize(17).text('Reasoning');
        doc.moveDown(0.5);
        doc.fontSize(13);
        if(analysis.reasoning == null) {
            doc.text(`-`,  { align: 'justify'});
        } else {
            doc.text(`${analysis.reasoning}`,  { align: 'justify'});
        }
        
        doc.moveDown();

        // Recommendation
        doc.fontSize(17).text('Recommendation');
        doc.moveDown(0.5);

        analysis.recommendations.forEach((item, index) => {
            doc.fontSize(15).text(
                `${index + 1}. ${item.job_title}`
            );

            doc.moveDown(0.2);

            doc.fontSize(13).text(
                `• Industry Sector Job : ${item.industry_sector_job}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Req Tech Skills : ${item.req_tech_skills}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Req Soft Skills : ${item.req_soft_skills}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Minimum Experience Year : ${item.minimum_experience_years}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Model Score : ${item.model_score}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Final Rank Score : ${item.final_rank_score}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Match Score Percent : ${item.match_score_percent}%`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Fit Category : ${item.fit_category}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• User Fit Label : ${item.user_fit_label}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Weighted Skill Score : ${item.weighted_skill_score}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Sector Similarity Score : ${item.sector_similarity_score}`,
                {
                    indent: 20 
                }
            );
            doc.fontSize(13).text(
                `• Skill Completeness Factor : ${item.skill_completeness_factor}`,
                {
                    indent: 20 
                }
            );
            if(item.matched_skills.length === 0){
                doc.text('• Matched Skills : -', 
                    {
                        indent: 20
                    }
                );
            } else {
                doc.text('• Matched Skills :', 
                    {
                        indent: 20
                    }
                );
                item.matched_skills.forEach((skill) => {
                    doc.text(`• ${skill}`, {
                        indent: 40,
                    });
                });
            }
            if(item.missing_skills.length === 0){
                doc.text('• Missing Skills : -', 
                    {
                        indent: 20
                    }
                );
            } else {
                doc.text('• Missing Skills :', 
                    {
                        indent: 20
                    }
                );
                item.missing_skills.forEach((skill) => {
                    doc.text(`• ${skill}`, {
                        indent: 40,
                    });
                });
            }
            doc.fontSize(13).text(
                `• Why You Match : ${item.why_you_match}`,
                {
                    indent: 20 ,
                    align: 'justify',
                }
            );
            
            doc.moveDown(0.5);
        });

        doc.moveDown();

        // Created At
        doc.fontSize(12);
        doc.text(
            `Created At : ${new Date(analysis.created_at).toLocaleString()}`
        );

        doc.end();
    });
};

export default generatePdfBuffer;