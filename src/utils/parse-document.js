import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

const parseDocument = async (file) => {

    let extractedText = '';

    // PDF
    if (file.mimetype === 'application/pdf') {

        const pdf = await pdfjsLib.getDocument({
            data: new Uint8Array(file.buffer),
        }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {

            const page = await pdf.getPage(i);

            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');

            extractedText += pageText + ' ';
        }

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