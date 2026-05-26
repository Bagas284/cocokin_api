import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import AnalysisRepositories from '../../analysis/repositories/analysis-repositories.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';

export const getAllAnalysis = async(req, res, next) => {
    const { id: user_id } = req.user;
    const analysis = await AnalysisRepositories.getAllAnalysis(user_id);
    return response(res, 200, 'Analysis berhasil ditampilkan', analysis);
}

export const getAnalysisById = async(req, res, next) => {
    const { id } = req.params;
    const { id: user_id } = req.user;

    const isOwner = await AnalysisRepositories.verifyAnalysisOwner(id, user_id);
  
    if (isOwner === null) {
        return next(new NotFoundError('Analysis tidak ditemukan'));
    }

    if(isOwner === false) {
        return next(new AuthorizationError('Anda tidak berhak mengakses Analysis ini'));
    }

    const analysis = await AnalysisRepositories.getAnalysisById(id);
    
    return response(res, 200, 'Analysis berhasil ditampilkan', analysis);
}