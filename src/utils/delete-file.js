import fs from 'fs/promises';

const deleteFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Gagal hapus file:', error.message);
    }
};

export default deleteFile;