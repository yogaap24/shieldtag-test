# Proyek Sistem Login Full-Stack (ShieldTag Test)

Proyek ini adalah sistem login full-stack sederhana yang terdiri dari backend **Express.js** (API) dan frontend **Next.js** (Klien). Tujuannya adalah untuk mendemonstrasikan implementasi alur autentikasi yang aman dengan praktik modern.

## Struktur Direktori

```
shiledtag-test/
├── api/       # Backend Express.js
└── test/      # Frontend Next.js
```

-----

## Backend: Express.js API 🛡️

Backend ini menangani semua logika bisnis dan keamanan, termasuk registrasi pengguna, validasi login, dan perlindungan data melalui REST API.

### Fitur Keamanan Utama

  * **Password Hashing (bcryptjs):** Password tidak pernah disimpan sebagai teks biasa. Kami menggunakan **bcrypt** untuk membuat *hash* yang kuat dan di-*salt* untuk melindungi kredensial jika terjadi kebocoran database.
  * **Autentikasi Stateless (JWT):** Setelah login, klien menerima **JSON Web Token (JWT)**. Token ini harus disertakan di *header* `x-auth-token` untuk mengakses rute yang dilindungi, memastikan setiap permintaan diverifikasi secara independen.
  * **Pertahanan Berlapis:**
      * **Validasi Input (`express-validator`):** Mencegah data berbahaya dengan memvalidasi semua input dari klien.
      * **Keamanan Header HTTP (`helmet`):** Melindungi dari serangan umum seperti XSS dan *clickjacking*.
      * **Rate Limiting (`express-rate-limit`):** Mencegah serangan *brute-force* pada endpoint login.

### Teknologi & Library Backend

| Library | Alasan Penggunaan |
| :--- | :--- |
| **Express.js** | Framework web minimalis untuk membangun REST API dengan cepat. |
| **bcryptjs** | Implementasi `bcrypt` yang aman untuk *hashing* password. |
| **jsonwebtoken** | Standar industri untuk membuat dan memverifikasi JWT. |
| **lowdb** | Database berbasis file JSON yang sederhana untuk persistensi data tanpa server. |
| **dotenv** | Memisahkan konfigurasi rahasia (kunci API, port) dari kode sumber. |
| **cors** | Mengizinkan permintaan *cross-origin* dari frontend. |

### Endpoint API

  * `POST /api/auth/register` : Mendaftarkan pengguna baru.
  * `POST /api/auth/login` : Login pengguna dan mendapatkan token JWT.
  * `GET /api/auth/me` : Mendapatkan data pengguna yang sedang login (memerlukan token).

-----

## Frontend: Next.js Client 🖥️

Frontend ini menyediakan antarmuka pengguna untuk berinteraksi dengan API, memungkinkan pengguna untuk mendaftar, login, dan melihat profil mereka.

### Fitur Utama Aplikasi

  * **Antarmuka Pengguna Reaktif:** Dibangun dengan **React**, menyediakan alur yang jelas untuk registrasi, login, dan halaman profil.
  * **Manajemen Sesi Sisi Klien:** Status login dikelola dengan menyimpan **JWT** di `localStorage` browser.
  * **Rute Terlindungi:** Halaman profil dilindungi dari akses tidak sah. Pengguna akan diarahkan ke halaman login jika token tidak ada atau tidak valid.
  * **Komunikasi API:** Menggunakan **Fetch API** bawaan browser untuk interaksi asinkron dengan backend.

### Teknologi Frontend

| Teknologi | Alasan Penggunaan |
| :--- | :--- |
| **Next.js** | Framework React dengan *file-based routing* dan optimasi bawaan. |
| **React** | Library utama untuk membangun antarmuka pengguna berbasis komponen. |
| **Fetch API** | API bawaan browser untuk melakukan permintaan HTTP tanpa dependensi eksternal. |
| **CSS Modules** | Untuk *styling* komponen secara terisolasi dan mudah dikelola. |

-----

## Instalasi & Menjalankan Proyek 🚀

Untuk menjalankan proyek ini secara penuh, Anda perlu menjalankan **dua terminal terpisah**.

### **Prasyarat**

  * [Node.js](https://nodejs.org/) (versi 18 atau lebih tinggi)
  * npm atau package manager lainnya

### **Langkah 1: Menjalankan Backend (API)**

1.  Buka terminal pertama dan masuk ke direktori `api`:
    ```bash
    cd api
    ```
2.  Instal semua dependensi:
    ```bash
    npm install
    ```
3.  Buat file `.env` di dalam direktori `api` dan tambahkan variabel berikut:
    ```
    PORT=3030
    JWT_SECRET=kunci-rahasia-yang-sangat-aman
    ```
4.  Jalankan server API:
    ```bash
    npm run dev
    ```
    ✅ Server API akan berjalan di **`http://localhost:3030`**. Biarkan terminal ini tetap berjalan.

### **Langkah 2: Menjalankan Frontend (Klien)**

1.  **Buka terminal baru**. Masuk ke direktori `test`:
    ```bash
    cd test
    ```
2.  Instal semua dependensi:
    ```bash
    npm install
    ```
3.  Buat file `.env.local` di dalam direktori `test` untuk menghubungkannya ke API:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:3030/api
    ```
4.  Jalankan aplikasi frontend:
    ```bash
    npm run dev
    ```
    ✅ Aplikasi frontend sekarang dapat diakses di **`http://localhost:3000`**.