# MK Mobile

Aplikasi Android offline-first untuk pencatatan keuangan. Semua transaksi, dompet, kategori, dan budget disimpan di `localStorage` perangkat. Aplikasi tidak memanggil backend atau membutuhkan internet setelah terpasang.

## Fitur

- Dashboard, transaksi, budget 50/30/20, dan kalkulator finansial.
- Data lokal per perangkat.
- Export seluruh data menjadi file JSON.
- Import file JSON untuk memindahkan data ke perangkat lain.
- Android APK melalui Capacitor.

## Menjalankan

```powershell
npm install
npm run dev
```

## Membuat APK debug

Pastikan Android Studio, Android SDK, dan Java/Gradle Android tersedia di komputer.

```powershell
npm run android:debug
```

APK hasil build berada di:

`android/app/build/outputs/apk/debug/app-debug.apk`

File tersebut dapat langsung dipindahkan ke Android dan di-install (aktifkan izin instalasi dari sumber tidak dikenal bila diminta).

## Catatan data

Gunakan **Pengaturan > Export Data** sebelum menghapus aplikasi atau pindah perangkat. Di perangkat baru, install APK, buka **Pengaturan > Import Data**, lalu pilih file JSON backup.
