import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import ExportPdfRepositories from '../../exportPdf/repositories/exportpdf-repositories.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';
import AnalysisRepositories from '../../analysis/repositories/analysis-repositories.js';
import generatePdfBuffer from '../generator/pdf-generator.js';

export const createPdf = async(req, res, next) => {
    const { id } = req.params;
    const { id: user_id } = req.user;

    const isOwner = await AnalysisRepositories.verifyAnalysisOwner(id, user_id);
  
    if (isOwner === null) {
        return next(new NotFoundError('Analysis tidak ditemukan'));
    }

    if(isOwner === false) {
        return next(new AuthorizationError('Anda tidak berhak mengakses Analysis ini'));
    }

    const analysis = await ExportPdfRepositories.createPdf(id);

    const pdfBuffer = await generatePdfBuffer(analysis);

    res.setHeader(
        'Content-Type',
        'application/pdf'
    );

    res.setHeader(
        'Content-Disposition',
        `attachment; filename=analysis-${id}.pdf`
    );
    
    return res.send(pdfBuffer);

    return response(res, 200, 'Analysis berhasil ditampilkan', analysis);
}