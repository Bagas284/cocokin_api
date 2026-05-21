import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { InvariantError } from '../exceptions/index.js';

const uploadPath = 'src/uploads/photos';

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '-');

    const uniqueName = `${Date.now()}-${fileName}${ext}`;

    cb(null, uniqueName);
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