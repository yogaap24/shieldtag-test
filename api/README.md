-----

# Backend Sistem Login Aman - Express.js

Proyek ini adalah implementasi backend untuk sistem registrasi dan login yang aman menggunakan **Node.js** dan **Express.js**. API ini dibangun dengan fokus pada praktik keamanan modern untuk melindungi data pengguna dan mencegah celah keamanan umum.

-----

## Fitur Keamanan Utama 🛡️

Sistem ini dirancang dengan beberapa lapisan pertahanan untuk memastikan integritas dan kerahasiaan data.

### **1. Password Hashing (bcryptjs)**

Password pengguna tidak pernah disimpan sebagai teks biasa. Sebaliknya, kami menggunakan algoritma **bcrypt** untuk membuat *hash* yang kuat sebelum menyimpannya ke database.

  * **Alasan:** Jika terjadi kebocoran data, kredensial pengguna tetap aman karena hash sangat sulit untuk dipecahkan. `bcrypt` secara otomatis mengelola *salting* untuk mencegah serangan *rainbow table*.

### **2. Autentikasi Stateless (JWT - JSON Web Token)**

Setelah login berhasil, server memberikan token **JWT** yang ditandatangani secara digital kepada klien. Klien harus menyertakan token ini di *header* `x-auth-token` pada setiap permintaan ke rute yang memerlukan autentikasi.

  * **Alasan:** Pendekatan *stateless* ini ideal untuk REST API karena meningkatkan skalabilitas dan menyederhanakan arsitektur. Server tidak perlu menyimpan informasi sesi, membuat setiap permintaan menjadi independen.

### **3. Pertahanan Berlapis (Middleware)**

Keamanan API diperkuat melalui serangkaian *middleware* yang memeriksa setiap permintaan masuk:

  * **Validasi Input (`express-validator`):** Setiap data yang dikirim oleh pengguna (misalnya, format email dan panjang password) divalidasi secara ketat di sisi server untuk mencegah data berbahaya atau tidak valid masuk ke sistem.
  * **Keamanan Header HTTP (`helmet`):** Middleware `helmet` secara otomatis mengatur berbagai *header* HTTP untuk melindungi dari serangan umum seperti *Cross-Site Scripting* (XSS), *clickjacking*, dan lainnya.
  * **Pembatasan Tingkat Permintaan (`express-rate-limit`):** Untuk mencegah serangan *brute-force*, jumlah permintaan login dari satu alamat IP dibatasi dalam periode waktu tertentu.

-----

## Teknologi & Library yang Digunakan 📚

| Library | Alasan Penggunaan |
| :--- | :--- |
| **Express.js** | Framework web minimalis dan fleksibel untuk membangun REST API dengan cepat. |
| **bcryptjs** | Implementasi `bcrypt` yang aman dan mudah digunakan untuk *hashing* password. |
| **jsonwebtoken** | Standar industri untuk membuat dan memverifikasi JSON Web Token (JWT). |
| **lowdb** | Database berbasis file JSON yang sederhana untuk persistensi data tanpa server DB. |
| **dotenv** | Mengelola variabel lingkungan dan memisahkan konfigurasi rahasia dari kode. |
| **cors** | Mengizinkan permintaan *cross-origin* agar frontend dapat berinteraksi dengan API. |
| **helmet** | Meningkatkan keamanan API dengan mengatur *header* HTTP yang aman secara otomatis. |
| **express-validator** | Menyediakan middleware yang kuat untuk validasi dan sanitasi input dari klien. |
| **express-rate-limit** | Melindungi endpoint penting dari serangan *brute-force* dengan membatasi permintaan. |
| **nodemon** | Alat pengembangan yang secara otomatis me-restart server saat ada perubahan kode. |

-----

## Instalasi & Menjalankan Proyek 🚀

1.  **Clone repositori ini:**

    ```bash
    git clone [URL-repositori-Anda]
    cd [nama-direktori]
    ```

2.  **Instal semua dependensi:**

    ```bash
    npm install
    ```

3.  **Buat file `.env`** di direktori utama dan isi dengan variabel berikut:

    ```
    PORT=5000
    JWT_SECRET=kunci-rahasia-yang-sangat-aman
    ```

4.  **Jalankan server dalam mode development:**

    ```bash
    npm run dev
    ```

    Server akan berjalan di `http://localhost:3000` (atau port yang Anda tentukan).

-----

## Endpoint API ⚙️

  * `POST /api/auth/register` : Mendaftarkan pengguna baru.
  * `POST /api/auth/login` : Login pengguna dan mendapatkan token JWT.
  * `GET /api/auth/me` : Mendapatkan data pengguna yang sedang login (memerlukan token).