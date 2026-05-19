import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import DocumentRepositories from '../repositories/document-repositories.js';
import DocumentParsingRepositories from '../repositories/documentParsing-repositories.js';
import parseDocument from '../../../utils/parse-document.js';
import cleanText from '../../../utils/clean-text.js';

export const addDocument = async(req, res, next) => {
    const { id: user_id } = req.user;
    const { target_role, portofolio_url } = req.validated;
    if (!req.file) {
      return next(new InvariantError('File wajib diupload'));
    }

    const newDoc = {
      file_name: req.file.originalname,
      file_url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mime_type: req.file.mimetype,
      target_role,
      portofolio_url,
      user_id,
    };

    //POST ke table documents
    const doc = await DocumentRepositories.addDocument(newDoc);

    if (!doc) {
      return next(new InvariantError('File gagal ditambahkan'));
    }

    //Proses mengubah dari file ke teks
    let extractedText = await parseDocument(req.file);
    extractedText = cleanText(extractedText);

    //POST ke table document_parsing
    await DocumentParsingRepositories.addParsing({ document_id: doc.id, extracted_text: extractedText });

    return response(res, 201, 'File berhasil ditambahkan', doc);
}

export const getAllDocument = async(req, res, next) => {
  const { id: user_id } = req.user;
  const doc = await DocumentRepositories.getAllDocument(user_id);
  return response(res, 200, 'File sukses ditampilkan', doc);
}