# 🚀 GitFlow Backend

**OAuth backend untuk [GitFlow](https://github.com/MuhammadReki/GitFlow)** — aplikasi GitHub client mobile berbasis Flutter.

Backend ini menangani proses autentikasi OAuth GitHub dan Google menggunakan **Node.js** dan **Vercel Serverless Functions**.

<div align="center">

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://gitflow-backend-xi.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-Serverless-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![OAuth](https://img.shields.io/badge/OAuth-GitHub%20%2B%20Google-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://oauth.net)

</div>

---

## 📌 Tentang Proyek

GitFlow Backend adalah backend serverless yang berfungsi sebagai perantara antara aplikasi mobile GitFlow dan layanan OAuth GitHub serta Google.

Backend ini menangani pertukaran authorization code menjadi access token dan proses callback autentikasi yang diperlukan oleh aplikasi mobile.

### Mengapa menggunakan backend?

**Client Secret tidak boleh disimpan langsung di aplikasi mobile.** Jika secret disertakan dalam aplikasi, nilainya berpotensi diekstrak oleh pihak lain.

Dengan menggunakan backend, kredensial OAuth disimpan sebagai environment variables di Vercel sehingga tidak perlu ditanamkan langsung ke dalam kode aplikasi mobile.

## ✨ Fitur Utama

- 🔐 Autentikasi OAuth GitHub.
- 🔑 Integrasi Google OAuth 2.0.
- 🔄 Pertukaran authorization code menjadi access token.
- 📱 Redirect hasil autentikasi Google ke deep link aplikasi GitFlow.
- ☁️ Deployment menggunakan Vercel Serverless Functions.
- 🛡️ Penyimpanan kredensial OAuth melalui environment variables.

---

## 🔌 API Endpoints

| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/auth/github` | Menukar GitHub authorization code menjadi access token. |
| `GET` | `/api/auth/google/callback` | Menangani callback Google OAuth dan mengarahkan pengguna kembali ke aplikasi. |

### Alur Autentikasi

```text
┌─────────────────┐
│  GitFlow Mobile │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub / Google │
│   OAuth Login   │
└────────┬────────┘
         │ Authorization Code
         ▼
┌─────────────────┐
│ GitFlow Backend │
│     Vercel      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OAuth Token API │
└────────┬────────┘
         │
         ▼
   Access Token /
   Auth Redirect
```

*Catatan: Alur detail pengiriman token dan redirect bergantung pada implementasi masing-masing endpoint.*

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Backend Platform:** Vercel Serverless Functions
- **Authentication:** GitHub OAuth
- **Identity Provider:** Google OAuth 2.0
- **Mobile Application:** Flutter

---

## 📁 Struktur Proyek

```text
gitflow-backend/
├── api/
│   └── auth/
│       ├── github.js
│       └── google/
│           └── callback.js
├── package.json
└── README.md
```

Keterangan:

- `api/auth/github.js` — endpoint `POST /api/auth/github`.
- `api/auth/google/callback.js` — endpoint `GET /api/auth/google/callback`.

*Struktur di atas mengikuti struktur endpoint yang digunakan dalam proyek.*

---

## ⚙️ Konfigurasi Environment Variables

Tambahkan environment variables berikut melalui **Vercel Dashboard → Project Settings → Environment Variables**.

| Variable | Keterangan |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID aplikasi OAuth GitHub. |
| `GITHUB_CLIENT_SECRET` | Client Secret aplikasi OAuth GitHub. |
| `GOOGLE_CLIENT_ID` | Client ID aplikasi Google OAuth. |
| `GOOGLE_CLIENT_SECRET` | Client Secret aplikasi Google OAuth. |

### Catatan Keamanan

- Jangan commit file `.env` yang berisi kredensial ke repository.
- Jangan menyimpan Client Secret di aplikasi mobile.
- Pastikan redirect URI pada konfigurasi GitHub dan Google OAuth sesuai dengan endpoint backend.
- Validasi authorization code dan tangani error autentikasi dengan benar.
- Hindari meneruskan access token melalui URL yang dapat tersimpan di log atau riwayat browser.

---

## 🚀 Deployment

### Opsi 1: Menggunakan Vercel CLI

Pastikan Git, Node.js, dan Vercel CLI sudah tersedia di lingkungan pengembangan.

Clone repository:

```bash
git clone https://github.com/MuhammadReki/gitflow-backend.git
```

Masuk ke direktori proyek:

```bash
cd gitflow-backend
```

Jalankan deployment:

```bash
vercel
```

Ikuti instruksi CLI untuk menghubungkan proyek dengan akun Vercel. Tambahkan environment variables yang diperlukan sebelum melakukan deployment produksi.

### Opsi 2: Menggunakan Vercel Dashboard

1. Buka [Vercel Dashboard](https://vercel.com/new).
2. Import repository `gitflow-backend` dari GitHub.
3. Konfigurasikan environment variables OAuth.
4. Pastikan konfigurasi deployment sudah sesuai.
5. Klik **Deploy**.

URL backend:

**https://gitflow-backend-xi.vercel.app**

---

## 🧪 Pengujian Endpoint

Untuk menguji respons error pada callback Google OAuth, jalankan:

```bash
curl -i "https://gitflow-backend-xi.vercel.app/api/auth/google/callback?error=test"
```

Jika implementasi callback mengembalikan redirect untuk parameter error tersebut, respons yang diharapkan adalah redirect menuju deep link aplikasi:

```text
HTTP/1.1 307 Temporary Redirect
Location: gitflow://auth/google?error=test
```

**Catatan:** Hasil tersebut merupakan respons yang diharapkan berdasarkan implementasi callback, bukan jaminan bahwa endpoint produksi saat ini sudah memberikan respons tersebut. Gunakan `curl -i` untuk memeriksa status dan header aktual.

---

## 🔗 Related Links

- 📱 [GitFlow Mobile Repository](https://github.com/MuhammadReki/GitFlow)
- 💻 [GitFlow Backend Repository](https://github.com/MuhammadReki/gitflow-backend)
- ☁️ [Vercel Deployment](https://gitflow-backend-xi.vercel.app)
- 🔐 [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- 🔑 [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

<div align="center">

**Made with ❤️ in Indonesia**

Developed by [Muhammad Reki](https://github.com/MuhammadReki)

Licensed under the MIT License.

</div>
