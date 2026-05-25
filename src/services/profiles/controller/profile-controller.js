import ProfileRepositories from '../repositories/profile-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';
import cloudinary from '../../../config/cloudinary.js';

export const getProfileByUserId = async (req, res, next) => {
    const { id: user_id } = req.user;

    const userProfile = await ProfileRepositories.getProfileByUserId(user_id);
    
    if (!userProfile) {
        return next(new NotFoundError('User Profile tidak ditemukan'));
    }
    
    return response(res, 200, 'User Profile berhasil ditampilkan', userProfile);
};

export const updateProfileByUserId = async (req, res, next) => {
    const { id: user_id } = req.user;
    const { bio, location } = req.validated;

    const userProfile = await ProfileRepositories.updateProfileByUserId({ user_id, bio, location });

    if(!userProfile) {
        return next(new InvariantError('Profile gagal diperbarui'));
    }
    
    return response(res, 200, 'User Profile berhasil diperbarui', userProfile);
};

export const updatePhotoByUserId = async (req, res, next) => {
    const { id: user_id } = req.user;
    
    if (!req.file) {
      return next(new InvariantError('File wajib diupload'));
    }

    const oldProfile = await ProfileRepositories.getPhotoByUserId(user_id);

    if (oldProfile?.photo_profile) {
        const splitUrl = oldProfile.photo_profile.split('/');

        const fileName = splitUrl[splitUrl.length - 1];

        const publicId = `profile-photos/${fileName.split('.')[0]}`;

        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.log('Gagal menghapus foto lama:', error.message);
        }
    }

    const newPhoto = {
        photo_profile: req.file.path,
        user_id,
    };

    const photo = await ProfileRepositories.updatePhotoByUserId(newPhoto);

    if (!photo) {
      return next(new InvariantError('Foto profile gagal diperbarui'));
    }

    return response(res, 200, 'User Profile berhasil diperbarui', photo);
};

export const getPhotoByUserId = async (req, res, next) => {
    const { id: user_id } = req.user;

    const userProfile = await ProfileRepositories.getPhotoByUserId(user_id);

    return response(res, 200, 'Foto profile berhasil diambil', {
        photo_profile: userProfile.photo_profile || 'https://res.cloudinary.com/dn6htf6bs/image/upload/v1779377064/default-profile_du5nhh.webp',
    });
}