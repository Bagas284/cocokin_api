import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadDocumentCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'documents',
                resource_type: 'raw',
                public_id: `${Date.now()}-${fileName}`,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

export default uploadDocumentCloudinary;