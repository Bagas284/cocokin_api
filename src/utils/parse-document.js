import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const pdfModule = require('pdf-parse');
const pdf = pdfModule.default || pdfModule;

const parseDocument = async (file) => {

    let extractedText = '';

    // PDF
    if (file.mimetype === 'application/pdf') {

        const data = await pdf(file.buffer);

        extractedText = data.text;
    }

    // DOCX
    else if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {

        const result = await mammoth.extractRawText({
            buffer: file.buffer,
        });

        extractedText = result.value;
    }

    return extractedText;
};

export default parseDocument;