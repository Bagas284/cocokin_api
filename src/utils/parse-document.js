import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const pdfModule = require('pdf-parse');
const pdf = pdfModule.default || pdfModule;

const parseDocument = async (file) => {

    // Validasi file PDF
    if (file.mimetype !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
    }

    // Parse PDF
    const data = await pdf(file.buffer);

    return data.text;
};

export default parseDocument;