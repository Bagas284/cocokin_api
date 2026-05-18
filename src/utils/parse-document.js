import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

const parseDocument = async (file) => {

  const filePath = file.path;

  let extractedText = '';

  if (file.mimetype === 'application/pdf') {

    const dataBuffer = fs.readFileSync(filePath);

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(dataBuffer),
    }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {

      const page = await pdf.getPage(i);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');

      extractedText += pageText + ' ';
    }
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({
            path: filePath,
        });

        extractedText = result.value;
    }

    return extractedText;
};

export default parseDocument;