import ProfileRepositories from '../repositories/profile-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';
import deleteFile from '../../../utils/delete-file.js';
import path from 'path';

export const getProfileByUserId = async (req, res, next) => {
    const { id } = req.params;
    const { id: user_id } = req.user;

    const isOwner = await ProfileRepositories.verifyProfileOwner(id, user_id);

    if (isOwner === null) {
        return next(new NotFoundError('User Profile tidak ditemukan'));
    }

    if(isOwner === false) {
        return next(new AuthorizationError('Anda tidak berhak mengakses profile ini'));
    }

    const userProfile = await ProfileRepositories.getProfileByUserId(id);
    
    return response(res, 200, 'User Profile berhasil ditampilkan', userProfile);
};

export const updateProfileByUserId = async (req, res, next) => {
    const { id } = req.params;
    const { id: user_id } = req.user;
    const { bio, location } = req.validated;

    const isOwner = await ProfileRepositories.verifyProfileOwner(id, user_id);

    if (isOwner === null) {
        return next(new NotFoundError('User Profile tidak ditemukan'));
    }

    if(isOwner === false) {
        return next(new AuthorizationError('Anda tidak berhak mengakses profile ini'));
    }

    const userProfile = await ProfileRepositories.updateProfileByUserId({ id, bio, location });
    
    return response(res, 200, 'User Profile berhasil diperbarui', userProfile);
};

export const updatePhotoByUserId = async (req, res, next) => {
    const { id } = req.params;
    const { id: user_id } = req.user;

    const isOwner = await ProfileRepositories.verifyProfileOwner(id, user_id);

    if (isOwner === null) {
        return next(new NotFoundError('User Profile tidak ditemukan'));
    }

    if(isOwner === false) {
        return next(new AuthorizationError('Anda tidak berhak mengakses profile ini'));
    }
    
    if (!req.file) {
      return next(new InvariantError('File wajib diupload'));
    }

    const oldProfile = await ProfileRepositories.getPhotoByUserId(id);

    if (
        oldProfile?.photo_profile &&
        oldProfile.photo_profile !== 'src/uploads/photos/default-profile.jpg'
    ) {
        const oldFilePath = path.join(
            process.cwd(),
            oldProfile.photo_profile
        );

        await deleteFile(oldFilePath);
    }

    const newPhoto = {
        photo_profile: `src/uploads/photos/${req.file.filename}`,
        id,
    };

    const photo = await ProfileRepositories.updatePhotoByUserId(newPhoto);

    if (!photo) {
      return next(new InvariantError('Foto profile gagal diperbarui'));
    }

    return response(res, 200, 'User Profile berhasil diperbarui', photo);
};

export const getPhotoByUserId = async (req, res, next) => {
    const { id } = req.params;
    const { id: user_id } = req.user;

    const isOwner = await ProfileRepositories.verifyProfileOwner(id, user_id);

    if (isOwner === null) {
        return next(new NotFoundError('User Profile tidak ditemukan'));
    }

    if(isOwner === false) {
        return next(new AuthorizationError('Anda tidak berhak mengakses profile ini'));
    }

    const userProfile = await ProfileRepositories.getPhotoByUserId(id);

    const filePath = userProfile.photo_profile
        ? path.join(process.cwd(), userProfile.photo_profile)
        : path.join(process.cwd(), 'src/uploads/photos/default-profile.jpg');

    return res.download(filePath);
}