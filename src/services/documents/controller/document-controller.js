import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import DocumentRepositories from '../repositories/document-repositories.js';
import uploadDocumentCloudinary from '../../../utils/upload-document-cloudinary.js';
import AnalysisRepositories from '../../analysis/repositories/analysis-repositories.js';
import { analyzeCV, mapAnalysisData } from '../../analysis/services/analysis-service.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import axios from 'axios';
import FormData from 'form-data';

export const addDocument = async(req, res, next) => {
    const { id: user_id } = req.user;
    const { target_role } = req.validated;

    if (!req.file) {
      return next(new InvariantError('File wajib diupload'));
    }

    const user = await UserRepositories.getUserById(user_id);

    const isExpired = user.subscription_expired_at && new Date(user.subscription_expired_at) < new Date();
    
    if(user.subscription_status === 'Premium User' && isExpired) {
      await UserRepositories.downgradeExpiredSubscription(user_id);
    }
    
    const isPremiumActive = user.subscription_status === 'Premium User' && user.subscription_expired_at && new Date(user.subscription_expired_at) > new Date();;

    if(!isPremiumActive){
      if (user.analysis_tokens <= 0) {
        return next(new InvariantError('Token analisis habis. Silahkan upgrade premium'));
      }

      await UserRepositories.decreaseToken(user_id);
    }

    const cloudinaryResult = await uploadDocumentCloudinary(
        req.file.buffer,
        req.file.originalname
    );

    if (!cloudinaryResult?.secure_url) {
      return next(new InvariantError('Upload file gagal'));
    }

    const newDoc = {
      file_name: req.file.originalname,
      file_url: cloudinaryResult.secure_url,
      size: req.file.size,
      mime_type: req.file.mimetype,
      target_role,
      user_id,
    };

    //POST ke table documents
    const doc = await DocumentRepositories.addDocument(newDoc);

    if (!doc) {
      return next(new InvariantError('File gagal ditambahkan'));
    }

    const aiResult = await analyzeCV(
      req.file,
      target_role
    );

    const analysisData = mapAnalysisData(
      doc.id,
      aiResult
    );

    const analysis = await AnalysisRepositories.addAnalysis(analysisData);

    if (!analysis) {
      return next(new InvariantError('Hasil analisis gagal disimpan'));
    }

    return response(res, 201, 'File berhasil ditambahkan dan analisis berhasil ditambahkan', { document: doc, analysis: analysis});
}

export const getAllDocument = async(req, res, next) => {
  const { id: user_id } = req.user;
  const doc = await DocumentRepositories.getAllDocument(user_id);
  return response(res, 200, 'File sukses ditampilkan', doc);
}

export const getDocumentById = async(req, res, next) => {
  const { id } = req.params;
  const { id: user_id } = req.user;

  const isOwner = await DocumentRepositories.verifyDocumentOwner(id, user_id);
  
  if (isOwner === null) {
      return next(new NotFoundError('Document tidak ditemukan'));
  }

  if(isOwner === false) {
      return next(new AuthorizationError('Anda tidak berhak mengakses document ini'));
  }

  const document = await DocumentRepositories.getDocumentById(id);

  return response(res, 200, 'Document berhasil diambil', document);
}