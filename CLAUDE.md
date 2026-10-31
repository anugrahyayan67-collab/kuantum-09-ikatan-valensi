# Konteks repo (untuk asisten AI)

- Video **"Jabat Tangan Elektron" — Kimia Kuantum: Teori Ikatan Valensi** (S1 Kimia UNESA, RPS pertemuan 9, setelah UTS) milik **Yayan** (Septian Anugrah). Mesin disalin dari `video-simbol-term` (Modul 7). Berikutnya: MOT diatomik (pertemuan 10–11), simetri (12–13). Aturan umum & pelajaran teknis: repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md`.
- Gaya seri kuantum Yayan: panggung gelap, aksen **emas–sian**, font Outfit + Source Serif 4 + JetBrains Mono, subtitle kata-per-kata. Tanpa nama di video (aturan video kuantum).
- Benang merah cerita: **dua atom H yang bergandengan** (kurva energi 74 pm / 4,75 eV) → mengapa (pertukaran + pasangan spin) → karbon & hibridisasi → kegagalan **O₂ paramagnetik** sebagai jembatan ke video orbital molekul.
- **Kode warna**: elektron/kerapatan = sian `C.cyan`, spin naik sian / turun merah muda `C.pink`, orbital s = biru `C.blue`, orbital p = emas `C.gold` (fase + / − : emas / ungu `C.violet`), hibrida = mint `C.mint`, ikatan σ = sian, ikatan π = jingga `C.amber`, energi/tolak = merah `C.red`; atom memakai warna CPK di `theme.ts` (H putih, C abu, N biru, O merah).
- **Semua adegan harus terus bergerak** (elektron di kotak orbital, vektor L/S berpresesi, tabel mikrostatus yang terkelupas, garis spektrum menyala).
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, minta pengguna menekan *Run workflow*.
- Narasi menyusul. Selalu sediakan versi tanpa narasi.

## Aturan konten & tata letak
- Rumus/simbol term utama ≥ 56 px (`Formula`), satu kartu per momen; zona subtitle (bawah 180 px) bebas; margin ≥ 80 px. Komponen HTML di luar `<Stage>`.
- Rumus kimia & hibrida ditulis dengan subskrip/superskrip benar (H₂, sp³; `Sup`/`Sub` di HTML, `tspan baselineShift` di SVG). Orbital 3D digambar dengan proyeksi sederhana dan rotasi pelan. Angka dicek di `naskah/AUDIT.md`.
- Teks TTS terpisah dari subtitle (`tts:` per baris; huruf tunggal dieja di `src/tts.ts`).
- Kemulusan: `EASE` lembut, fade keluar `EASE_IN_OUT`; tanpa ganti berdasarkan ambang (silang-pudar); tanpa CSS blur; tanpa filter pada garis lurus.

## QA
- `CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node scripts/qa-lines.mjs out/x <adegan...>` lalu `python3 scripts/contact.py out/x out/x-s 9`.
- `npm run check` (cek kata `wordOf`), uji kemulusan `node scripts/qa-film.mjs out/a.mp4 0 99999 0.25` lalu `python3 scripts/qa-glitch.py out/a.mp4 0`.
