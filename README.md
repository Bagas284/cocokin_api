## Deskripsi

Platform yang bertujuan untuk membantu pengguna mencapai tujuan tertentu melalui fitur-fitur yang tersedia.

---

## Tech Stack

Berikut adalah teknologi utama yang digunakan dalam proyek ini:

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript
- **Database:** PostgreSQL
- **Authentication:** JSON Web Token (JWT)
- **Environment Variables:** dotenv

---

## Cara Akses Secara Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

### 1. Prasyarat

Pastikan Anda telah menginstal:

- Node.js (versi LTS direkomendasikan)
- PostgreSQL
- npm

### 2. Clone Repository

```bash
git clone https://github.com/Bagas284/cocokin_api.git
```

### 3. Instal Dependencies

Jalankan perintah berikut untuk menginstal seluruh package yang dibutuhkan:

```bash
npm install
```

### 4. Konfigurasi Environment

Buat file `.env` di root project:

```env
PORT=3000
HOST=localhost

PGUSER=your_pg_user
PGHOST=localhost
PGPASSWORD=your_pg_password
PGDATABASE=database_name
PGPORT=your_pg_port

ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_key

EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass

AI_API=your_ai_api
```

### 5. Jalankan Migration Database

```bash
npm run migrate up
```

### 6. Menjalankan Server Development

Setelah konfigurasi selesai, jalankan server:

```bash
npm run start:dev
```

Server akan berjalan pada:

```text
http://localhost:3000
```
---