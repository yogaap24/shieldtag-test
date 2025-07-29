```markdown
# Proyek Sistem Login Full-Stack (ShieldTag Test)

Proyek ini adalah sistem login full-stack sederhana yang terdiri dari backend **Express.js** (API) dan frontend **Next.js** (Klien).

## Struktur Direktori
```

shiledtag-test/
├── api/       \# Backend Express.js
└── test/      \# Frontend Next.js

````

-----

## Instalasi & Menjalankan Proyek 🚀

Untuk menjalankan proyek ini secara penuh, Anda perlu menjalankan **dua terminal terpisah**, satu untuk backend dan satu untuk frontend.

### **Langkah 1: Menjalankan Backend (API)**

1.  Buka terminal pertama dan masuk ke direktori `api`:
    ```bash
    cd api
    ```

2.  Instal semua dependensi:
    ```bash
    npm install
    ```

3.  Buat file `.env` di dalam direktori `api` dan konfigurasikan (lihat `README.md` di dalam direktori `api` untuk detail).

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
3.  Buat file `.env.local` di dalam direktori `test` dan tambahkan baris berikut untuk menghubungkannya ke API:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:3030/api
    ```

4.  Jalankan aplikasi frontend:
    ```bash
    npm run dev
    ```
    ✅ Aplikasi frontend sekarang dapat diakses di **`http://localhost:3000`**.
````