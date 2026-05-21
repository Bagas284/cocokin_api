import { Pool } from "pg";

class ProfileRepositories {
    constructor() {
        this.pool = new Pool();
    }

    async getProfileByUserId(id) {
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
            values: [id],
        };
        
        const result = await this.pool.query(query);
        
        return result.rows[0];
    }

    async updateProfileByUserId({ id, bio, location }) {
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
            values: [bio, location, updatedAt, id],
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async updatePhotoByUserId({ photo_profile, id}) {
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
            values: [photo_profile, updatedAt, id],
        };

        const result = await this.pool.query(query);

        return result.rows[0];
    }

    async getPhotoByUserId(id) {
        const query = {
            text: `
            SELECT
                p.photo_profile
            FROM users u
            JOIN profiles p
                ON u.id = p.user_id
            WHERE u.id = $1
            `,
            values: [id],
        };

        const result = await this.pool.query(query);
        
        return result.rows[0];
    }

    async verifyProfileOwner(id, user_id){
        const query = {
            text: `
            SELECT *
            FROM users u
            JOIN profiles p
                ON u.id = p.user_id
            WHERE u.id = $1
            `,
            values: [id],
        };

        const result = await this.pool.query(query);
        if (!result.rows.length) {
            return null;
        }

        const profile = result.rows[0];

        if (profile.user_id !== user_id){
            return false;
        }

        return result.rows[0];
    }
}

export default new ProfileRepositories();