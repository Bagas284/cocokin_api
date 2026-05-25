import pool from '../../../database/pool.js';

class ProfileRepositories {
    async getProfileByUserId(user_id) {
        const query = {
            text: `
            SELECT
                u.id,
                p.id AS profile_id,
                u.name,
                u.email,
    
                p.bio,
                p.location
            FROM users u
            JOIN profiles p
                ON u.id = p.user_id
            WHERE u.id = $1
            `,
            values: [user_id],
        };
        
        const result = await pool.query(query);
        
        return result.rows[0];
    }

    async updateProfileByUserId({ user_id, bio, location }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: `
                UPDATE profiles 
                SET 
                    bio = $1, 
                    location = $2, 
                    updated_at = $3
                FROM users
                WHERE users.id = profiles.user_id AND users.id = $4 
                RETURNING users.id
            `,
            values: [bio, location, updatedAt, user_id],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }

    async updatePhotoByUserId({ photo_profile, user_id}) {
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: `
                UPDATE profiles 
                SET 
                    photo_profile = $1,
                    updated_at = $2
                FROM users
                WHERE users.id = profiles.user_id AND users.id = $3 
                RETURNING users.id
            `,
            values: [photo_profile, updatedAt, user_id],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }

    async getPhotoByUserId(user_id) {
        const query = {
            text: `
            SELECT
                p.photo_profile
            FROM users u
            JOIN profiles p
                ON u.id = p.user_id
            WHERE u.id = $1
            `,
            values: [user_id],
        };

        const result = await pool.query(query);
        
        return result.rows[0];
    }
}

export default new ProfileRepositories();