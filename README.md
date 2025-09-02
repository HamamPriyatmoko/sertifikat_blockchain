# Web Verifikasi Sertifikat Akademik

## Disusun oleh
- **Nama Mahasiswa**: Hamam Priyatmoko
- **NIM**: 20210140077

## Dosen Pembimbing
- **Ir. Eko Prasetyo, M.Eng., Ph.D.** (NIDN: 0522046701)
- **Prayitno, S.ST., M.T., Ph.D.** (NIDN: 0010048506)  
- **Cahya Damarjati, S.T., M.Eng., Ph.D.** (NIDN: 0515038702)

## Deskripsi Proyek
Frontend ini merupakan bagian dari sistem **Verifikasi Sertifikat Akademik berbasis Blockchain**.  
Aplikasi dibangun menggunakan **React** sebagai antarmuka pengguna (UI) yang memungkinkan admin dan publik untuk melakukan penerbitan serta verifikasi sertifikat.  

Frontend berfungsi sebagai jembatan interaktif antara **pengguna**, **Backend API (Flask)**, dan **Smart Contract (Ethereum via MetaMask)**.

## Fitur Utama
- **Admin Panel**
  - Login, Registrasi, Reset Password
  - Penerbitan Sertifikat (unggah file, input data mahasiswa)
  - Manajemen & Daftar Sertifikat
  - Unduh PDF Sertifikat + QR Code

- **Verifikasi Publik**
  - Verifikasi dengan **Input Hash**
  - Verifikasi dengan **Upload PDF**
  - Verifikasi dengan **Scan QR Code**
  - Tampilan detail sertifikat + data blockchain

## Teknologi yang Digunakan
- **React.js** (Frontend Framework)
- **MetaMask** (Integrasi Blockchain Ethereum)
- **Web3.js** (Interaksi dengan Smart Contract)
- **Fetch API** (Komunikasi ke Backend Flask API)
- **CSS** (UI Styling)
- **React Router** (Navigasi antar halaman)
- **QR Code Scanner Library** (Verifikasi berbasis QR)

## Persyaratan Sistem
- Node.js (versi 16+ direkomendasikan)
- npm atau yarn (package manager)
- Browser dengan **MetaMask Extension**
- Koneksi ke Backend API (Flask) dan jaringan Blockchain (Ganache/Testnet/Mainnet)

## Panduan Instalasi dan Menjalankan Proyek

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/web-verifikasi-sertifikat.git
   cd web-verifikasi-sertifikat
   ```
2. **Install Dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```
4. **Konfigurasi Environment**
   ```bash
   VITE_CONTRACT_ADDRESS=contractAddressAnda
   VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs
   VITE_VERIFY_BASE_URL=http://localhost:5173/verify
   VITE_RPC_URL=http://localhost:7545
   VITE_API_BASE=http://localhost:5000
   ```
6. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
8. **Build untuk Production**
   ```bash
   npm run build
   ```
