import UserRepositories from '../repositories/user-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';

export const createUser = async (req, res, next) => {
    const { name, email, password } = req.validated;

    const isUsernameExist = await UserRepositories.verifyNewUsername(email);
    if (isUsernameExist) {
        return next(new InvariantError('Gagal menambahkan user. Username sudah digunakan.'));
    }
    
    const user = await UserRepositories.createUser({
        name,
        email,
        password,
    });
    
    if (!user) {
        return next(new InvariantError('User gagal ditambahkan'));
    }
    
    return response(res, 201, 'User berhasil ditambahkan', user);
}