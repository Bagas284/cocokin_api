import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { InvariantError } from '../exceptions/index.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile-photos',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new InvariantError(
                'Hanya file JPG dan PNG yang diperbolehkan'
            ),
            false
        );
    }
};

const uploadPhoto = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default uploadPhoto;