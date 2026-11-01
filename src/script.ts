// Naskah narasi "Jabat Tangan Elektron" — Kimia Kuantum pertemuan 9: Teori Ikatan Valensi.
// Setiap adegan berisi baris narasi. Durasi baris dihitung otomatis dari jumlah
// suku kata (lihat timeline.ts) atau dari rekaman suara bila sudah ada,
// jadi cukup ubah teks di sini: visual, subtitle, dan musik ikut menyesuaikan.
//
// Aturan menulis teks narasi (dibaca mesin TTS):
//  - angka & simbol ditulis sebagai kata ("dua puluh meter per detik"),
//  - rumus ditulis sebagai kalimat; rumus rapi tampil di layar (komponen Formula).
// Angka & term sudah dicek di naskah/AUDIT.md (Atkins, Levine, CRC, NIST CCCBDB).
//
// hl     : kata/frasa yang disorot pada subtitle
// pause  : jeda (detik) SETELAH baris dibacakan
// lead   : jeda (detik) sebelum baris pertama adegan
// tail   : jeda (detik) setelah baris terakhir adegan
// fixed  : durasi tetap (detik) untuk adegan tanpa narasi

export type Line = {
  text: string;
  /** Teks khusus TTS (opsional). Bila kosong, dibuat otomatis oleh src/tts.ts. */
  tts?: string;
  hl?: string[];
  pause?: number;
};

export type SceneScript = {
  id: string;
  chapter: string; // nomor bab di heading, "" untuk tanpa heading
  part?: 1 | 2 | 3; // 1 prinsip & teori dasar, 2 implementasi dalam kimia, 3 penerapan
  title: string;
  lines: Line[];
  lead?: number;
  tail?: number;
  fixed?: number;
  mood: 'mystery' | 'title' | 'wonder' | 'build' | 'quantum' | 'tension' | 'bright' | 'resolve' | 'outro';
};

export const SCRIPT: SceneScript[] = [
  {
    "id": "hook",
    "chapter": "",
    "title": "Mengapa atom mau bergandengan",
    "mood": "mystery",
    "lead": 1.6,
    "tail": 1.2,
    "lines": [
      {
        "text": "Dua atom hidrogen melayang di ruang hampa. Masing-masing punya satu elektron, dan masing-masing netral.",
        "hl": [
          "satu elektron"
        ],
        "pause": 0.9
      },
      {
        "text": "Mereka saling mendekat, lalu tiba-tiba terkunci menjadi satu molekul, melepaskan energi sekitar empat ratus tiga puluh enam kilojoule per mol.",
        "hl": [
          "terkunci"
        ],
        "pause": 0.9
      },
      {
        "text": "Tidak ada muatan yang tarik-menarik seperti pada garam dapur. Lalu apa yang mengikat mereka?",
        "hl": [
          "apa yang mengikat mereka"
        ],
        "pause": 1.0
      },
      {
        "text": "Kimiawan sudah lama menggambar ikatan sebagai sepasang elektron yang dipakai bersama. Tapi mengapa berbagi elektron menurunkan energi?",
        "hl": [
          "mengapa"
        ],
        "pause": 0.9
      },
      {
        "text": "Jawabannya baru datang pada tahun seribu sembilan ratus dua puluh tujuh, dari mekanika kuantum.",
        "hl": [
          "mekanika kuantum"
        ],
        "pause": 0.9
      },
      {
        "text": "Hari ini kita membedah jawaban itu: teori ikatan valensi, jabat tangan dua elektron.",
        "hl": [
          "teori ikatan valensi"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "title",
    "chapter": "",
    "title": "Jabat Tangan Elektron",
    "mood": "title",
    "fixed": 7,
    "lines": []
  },
  {
    "id": "roadmap",
    "chapter": "",
    "title": "Peta video",
    "mood": "wonder",
    "lead": 0.8,
    "tail": 1.4,
    "lines": [
      {
        "text": "Perjalanan kita punya tiga bagian.",
        "pause": 0.6
      },
      {
        "text": "Pertama, prinsip dasar: kurva energi, fungsi gelombang Heitler–London, pasangan spin, dan tumpang tindih orbital.",
        "hl": [
          "prinsip dasar"
        ],
        "pause": 0.7,
        "tts": "Pertama, prinsip dasar: kurva energi, fungsi gelombang Haitler London, pasangan spin, dan tumpang tindih orbital."
      },
      {
        "text": "Kedua, implementasi dalam kimia: hibridisasi, bentuk molekul, pasangan elektron bebas, dan resonansi.",
        "hl": [
          "implementasi dalam kimia"
        ],
        "pause": 0.7
      },
      {
        "text": "Ketiga, penerapan: wujud karbon, plastik yang menghantarkan listrik, dan satu kegagalan penting yang membuka teori berikutnya.",
        "hl": [
          "kegagalan penting"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "lewis",
    "chapter": "01",
    "title": "Pasangan elektron Lewis",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Tahun seribu sembilan ratus enam belas, Gilbert Lewis mengusulkan ikatan kovalen sebagai sepasang elektron yang dimiliki dua atom.",
        "hl": [
          "sepasang elektron"
        ],
        "pause": 0.7,
        "tts": "Tahun seribu sembilan ratus enam belas, Gilbert Luis mengusulkan ikatan kovalen sebagai sepasang elektron yang dimiliki dua atom."
      },
      {
        "text": "Gambar titik dan garisnya masih kita pakai sampai sekarang.",
        "hl": [
          "titik dan garisnya"
        ],
        "pause": 0.7
      },
      {
        "text": "Tapi Lewis tidak bisa menjawab dua pertanyaan: mengapa harus berpasangan, dan mengapa berbagi itu lebih stabil.",
        "hl": [
          "dua pertanyaan"
        ],
        "pause": 0.7
      },
      {
        "text": "Elektron saling tolak. Menaruh dua elektron di tempat yang sama seharusnya menaikkan energi, bukan menurunkannya.",
        "hl": [
          "saling tolak"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "curve",
    "chapter": "02",
    "title": "Kurva energi H₂",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Mari ukur energinya. Sumbu datar adalah jarak antarinti, sumbu tegak adalah energi.",
        "hl": [
          "jarak antarinti"
        ],
        "pause": 0.7
      },
      {
        "text": "Saat jauh, kedua atom tidak saling merasakan, energinya kita sebut nol.",
        "hl": [
          "nol"
        ],
        "pause": 0.7
      },
      {
        "text": "Saat mendekat, energi turun, sampai titik terendah pada jarak tujuh puluh empat pikometer.",
        "hl": [
          "tujuh puluh empat pikometer"
        ],
        "pause": 0.7
      },
      {
        "text": "Lebih dekat lagi, kedua inti saling tolak dan energi melonjak naik.",
        "hl": [
          "melonjak naik"
        ],
        "pause": 0.7
      },
      {
        "text": "Kedalaman sumur itu sekitar empat koma tujuh lima elektronvolt. Itulah kekuatan ikatan H dua.",
        "hl": [
          "empat koma tujuh lima elektronvolt"
        ],
        "pause": 0.9,
        "tts": "Kedalaman sumur itu sekitar empat koma tujuh lima elektronvolt. Itulah kekuatan ikatan ha dua."
      }
    ]
  },
  {
    "id": "heitler",
    "chapter": "03",
    "title": "Heitler dan London",
    "mood": "quantum",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Tahun seribu sembilan ratus dua puluh tujuh, Walter Heitler dan Fritz London menerapkan persamaan Schrödinger pada molekul hidrogen.",
        "hl": [
          "Heitler",
          "London"
        ],
        "pause": 0.7,
        "tts": "Tahun seribu sembilan ratus dua puluh tujuh, Walter Haitler dan Frits London menerapkan persamaan Syrodinger pada molekul hidrogen."
      },
      {
        "text": "Tebakan pertama: elektron satu di atom A, elektron dua di atom B.",
        "hl": [
          "tebakan pertama"
        ],
        "pause": 0.7,
        "tts": "Tebakan pertama: elektron satu di atom a, elektron dua di atom be."
      },
      {
        "text": "Tapi elektron identik, jadi susunan sebaliknya sama sahnya: elektron dua di A, elektron satu di B.",
        "hl": [
          "sama sahnya"
        ],
        "pause": 0.7,
        "tts": "Tapi elektron identik, jadi susunan sebaliknya sama sahnya: elektron dua di a, elektron satu di be."
      },
      {
        "text": "Fungsi gelombang yang benar menjumlahkan keduanya. Elektron tidak lagi milik satu atom; keduanya bertukar tempat.",
        "hl": [
          "bertukar tempat"
        ],
        "pause": 0.7
      },
      {
        "text": "Hasil hitungannya: sumur energi muncul, sekitar tiga koma satu elektronvolt. Belum tepat, tapi ikatan kovalen terjelaskan untuk pertama kali.",
        "hl": [
          "untuk pertama kali"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "exchange",
    "chapter": "04",
    "title": "Rahasia di antara inti",
    "mood": "wonder",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Apa yang terjadi pada elektronnya? Lihat kerapatan elektron dari fungsi yang dijumlahkan.",
        "hl": [
          "kerapatan elektron"
        ],
        "pause": 0.7
      },
      {
        "text": "Kerapatan menumpuk di antara kedua inti, seperti lem yang ditarik oleh keduanya sekaligus.",
        "hl": [
          "di antara kedua inti"
        ],
        "pause": 0.7
      },
      {
        "text": "Elektron di daerah itu merasakan tarikan dua proton, sehingga energinya lebih rendah daripada di atom sendirian.",
        "hl": [
          "dua proton"
        ],
        "pause": 0.7
      },
      {
        "text": "Kalau fungsinya dikurangkan, muncul simpul tepat di tengah. Elektron menjauh dari celah itu, dan atom-atom saling tolak.",
        "hl": [
          "simpul"
        ],
        "pause": 0.7
      },
      {
        "text": "Efek penjumlahan dan pengurangan ini disebut efek pertukaran. Tidak ada padanannya dalam fisika klasik.",
        "hl": [
          "efek pertukaran"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "spinpair",
    "chapter": "05",
    "title": "Pasangan spin",
    "mood": "tension",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Ingat larangan Pauli: fungsi gelombang total harus berganti tanda bila dua elektron ditukar.",
        "hl": [
          "larangan Pauli"
        ],
        "pause": 0.7
      },
      {
        "text": "Bagian ruang yang dijumlahkan bersifat simetris. Maka bagian spinnya harus antisimetris: itulah singlet.",
        "hl": [
          "singlet"
        ],
        "pause": 0.7
      },
      {
        "text": "Jadi ikatan hanya terbentuk bila kedua spin berlawanan. Inilah alasan kuantum di balik pasangan elektron Lewis.",
        "hl": [
          "spin berlawanan"
        ],
        "pause": 0.7
      },
      {
        "text": "Bila kedua spin sejajar, keadaan triplet, bagian ruangnya harus antisimetris, ada simpul di tengah, dan kurva energinya naik terus.",
        "hl": [
          "triplet"
        ],
        "pause": 0.7
      },
      {
        "text": "Dua atom hidrogen dengan spin sejajar tidak akan pernah berikatan.",
        "hl": [
          "tidak akan pernah"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "ionic",
    "chapter": "06",
    "title": "Struktur ionik & resonansi",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Heitler–London hanya memakai susunan kovalen: satu elektron di tiap atom.",
        "hl": [
          "susunan kovalen"
        ],
        "pause": 0.7,
        "tts": "Haitler London hanya memakai susunan kovalen: satu elektron di tiap atom."
      },
      {
        "text": "Sesekali kedua elektron bisa berada di atom yang sama, menghasilkan H plus dan H minus.",
        "hl": [
          "H plus dan H minus"
        ],
        "pause": 0.7,
        "tts": "Sesekali kedua elektron bisa berada di atom yang sama, menghasilkan ha plus dan ha minus."
      },
      {
        "text": "Menambahkan sedikit susunan ionik ini, ditambah penyesuaian ukuran orbital, energi ikatannya mendekati empat elektronvolt.",
        "hl": [
          "mendekati empat elektronvolt"
        ],
        "pause": 0.7
      },
      {
        "text": "Pencampuran beberapa struktur seperti ini disebut resonansi.",
        "hl": [
          "resonansi"
        ],
        "pause": 0.7
      },
      {
        "text": "Resonansi bukan molekul yang berganti-ganti bentuk. Molekul nyata adalah satu keadaan campuran, lebih stabil daripada tiap strukturnya.",
        "hl": [
          "satu keadaan campuran"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "overlap",
    "chapter": "07",
    "title": "Tumpang tindih orbital",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Dari kasus hidrogen muncul satu aturan praktis: ikatan makin kuat bila orbital kedua atom makin banyak bertumpang tindih.",
        "hl": [
          "bertumpang tindih"
        ],
        "pause": 0.7
      },
      {
        "text": "Bila orbital bertemu ujung ke ujung, sepanjang sumbu ikatan, terbentuk ikatan sigma.",
        "hl": [
          "ikatan sigma"
        ],
        "pause": 0.7
      },
      {
        "text": "Ikatan sigma bisa dari s dengan s, s dengan p, atau p dengan p yang saling menghadap.",
        "hl": [
          "s dengan p"
        ],
        "pause": 0.7,
        "tts": "Ikatan sigma bisa dari es dengan es, es dengan pe, atau pe dengan pe yang saling menghadap."
      },
      {
        "text": "Bila dua orbital p sejajar dan bertemu dari samping, terbentuk ikatan pi, dengan kerapatan di atas dan di bawah sumbu.",
        "hl": [
          "ikatan pi"
        ],
        "pause": 0.7,
        "tts": "Bila dua orbital pe sejajar dan bertemu dari samping, terbentuk ikatan pi, dengan kerapatan di atas dan di bawah sumbu."
      },
      {
        "text": "Tumpang tindih samping lebih kecil, jadi ikatan pi umumnya lebih lemah daripada sigma.",
        "hl": [
          "lebih lemah"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "promotion",
    "chapter": "08",
    "title": "Teka-teki karbon",
    "mood": "tension",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Sekarang karbon. Konfigurasinya dua s dua, dua p dua: hanya dua elektron tak berpasangan.",
        "hl": [
          "dua elektron tak berpasangan"
        ],
        "pause": 0.7,
        "tts": "Sekarang karbon. Konfigurasinya dua es dua, dua pe dua: hanya dua elektron tak berpasangan."
      },
      {
        "text": "Menurut aturan pasangan spin, karbon seharusnya hanya membentuk dua ikatan. Tapi metana, C H empat, punya empat ikatan.",
        "hl": [
          "empat ikatan"
        ],
        "pause": 0.7,
        "tts": "Menurut aturan pasangan spin, karbon seharusnya hanya membentuk dua ikatan. Tapi metana, ce ha empat, punya empat ikatan."
      },
      {
        "text": "Jalan keluarnya: promosi. Satu elektron dua s naik ke orbital dua p yang kosong, sehingga ada empat elektron tak berpasangan.",
        "hl": [
          "promosi"
        ],
        "pause": 0.7,
        "tts": "Jalan keluarnya: promosi. Satu elektron dua es naik ke orbital dua pe yang kosong, sehingga ada empat elektron tak berpasangan."
      },
      {
        "text": "Promosi butuh energi, tapi dua ikatan tambahan melepaskan energi jauh lebih besar. Hasil akhirnya untung.",
        "hl": [
          "untung"
        ],
        "pause": 0.7
      },
      {
        "text": "Masalah baru: satu orbital s dan tiga orbital p berbeda bentuk. Padahal keempat ikatan metana identik.",
        "hl": [
          "identik"
        ],
        "pause": 0.9,
        "tts": "Masalah baru: satu orbital es dan tiga orbital pe berbeda bentuk. Padahal keempat ikatan metana identik."
      }
    ]
  },
  {
    "id": "sp3",
    "chapter": "09",
    "title": "Hibridisasi sp³",
    "mood": "wonder",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Tahun seribu sembilan ratus tiga puluh satu, Linus Pauling menyarankan: campurkan orbital s dan p menjadi orbital baru.",
        "hl": [
          "Linus Pauling"
        ],
        "pause": 0.7,
        "tts": "Tahun seribu sembilan ratus tiga puluh satu, Linus Poling menyarankan: campurkan orbital es dan pe menjadi orbital baru."
      },
      {
        "text": "Satu s dan tiga p menghasilkan empat orbital hibrida sp tiga yang identik.",
        "hl": [
          "sp tiga"
        ],
        "pause": 0.7,
        "tts": "Satu es dan tiga pe menghasilkan empat orbital hibrida es pe tiga yang identik."
      },
      {
        "text": "Masing-masing punya satu lobus besar yang menonjol ke satu arah, cocok untuk tumpang tindih yang kuat.",
        "hl": [
          "lobus besar"
        ],
        "pause": 0.7
      },
      {
        "text": "Agar saling menjauh sejauh mungkin, keempatnya menunjuk ke sudut-sudut tetrahedron, dengan sudut seratus sembilan koma lima derajat.",
        "hl": [
          "seratus sembilan koma lima derajat"
        ],
        "pause": 0.7
      },
      {
        "text": "Empat hibrida bertemu empat orbital s hidrogen: empat ikatan sigma yang identik. Metana terjelaskan.",
        "hl": [
          "Metana terjelaskan"
        ],
        "pause": 0.9,
        "tts": "Empat hibrida bertemu empat orbital es hidrogen: empat ikatan sigma yang identik. Metana terjelaskan."
      }
    ]
  },
  {
    "id": "sp2",
    "chapter": "10",
    "title": "Hibridisasi sp² & ikatan rangkap",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Bagaimana dengan etilena, C dua H empat? Di sini karbon mencampur satu s dengan dua p saja.",
        "hl": [
          "etilena"
        ],
        "pause": 0.7,
        "tts": "Bagaimana dengan etilena, ce dua ha empat? Di sini karbon mencampur satu es dengan dua pe saja."
      },
      {
        "text": "Hasilnya tiga hibrida sp dua dalam satu bidang, bersudut seratus dua puluh derajat.",
        "hl": [
          "seratus dua puluh derajat"
        ],
        "pause": 0.7,
        "tts": "Hasilnya tiga hibrida es pe dua dalam satu bidang, bersudut seratus dua puluh derajat."
      },
      {
        "text": "Satu orbital p tersisa, tegak lurus bidang. Dua orbital p dari dua karbon bertumpang tindih dari samping: ikatan pi.",
        "hl": [
          "ikatan pi"
        ],
        "pause": 0.7,
        "tts": "Satu orbital pe tersisa, tegak lurus bidang. Dua orbital pe dari dua karbon bertumpang tindih dari samping: ikatan pi."
      },
      {
        "text": "Ikatan rangkap dua adalah satu sigma ditambah satu pi.",
        "hl": [
          "satu sigma ditambah satu pi"
        ],
        "pause": 0.7
      },
      {
        "text": "Memutar ikatan rangkap berarti memutus tumpang tindih pi. Itu sebabnya ikatan rangkap kaku, dan ada isomer cis dan trans.",
        "hl": [
          "isomer cis dan trans"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "sp",
    "chapter": "11",
    "title": "Hibridisasi sp & ikatan rangkap tiga",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Pada asetilena, karbon mencampur satu s dengan satu p: dua hibrida sp yang berlawanan arah, seratus delapan puluh derajat.",
        "hl": [
          "seratus delapan puluh derajat"
        ],
        "pause": 0.7,
        "tts": "Pada asetilena, karbon mencampur satu es dengan satu pe: dua hibrida es pe yang berlawanan arah, seratus delapan puluh derajat."
      },
      {
        "text": "Dua orbital p tersisa membentuk dua ikatan pi yang saling tegak lurus, membungkus sumbu ikatan.",
        "hl": [
          "dua ikatan pi"
        ],
        "pause": 0.7,
        "tts": "Dua orbital pe tersisa membentuk dua ikatan pi yang saling tegak lurus, membungkus sumbu ikatan."
      },
      {
        "text": "Ikatan rangkap tiga: satu sigma dan dua pi.",
        "hl": [
          "satu sigma dan dua pi"
        ],
        "pause": 0.7
      },
      {
        "text": "Makin banyak ikatan, makin pendek dan makin kuat: tunggal sekitar seratus lima puluh empat pikometer, rangkap dua seratus tiga puluh empat, rangkap tiga seratus dua puluh.",
        "hl": [
          "makin pendek dan makin kuat"
        ],
        "pause": 0.7
      },
      {
        "text": "Energinya pun naik: kira-kira tiga ratus lima puluh, enam ratus sepuluh, dan delapan ratus empat puluh kilojoule per mol.",
        "hl": [
          "Energinya pun naik"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "lonepair",
    "chapter": "12",
    "title": "Pasangan elektron bebas",
    "mood": "quantum",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Nitrogen dan oksigen juga memakai hibrida yang mirip sp tiga, tapi tidak semua hibridanya dipakai berikatan.",
        "hl": [
          "tidak semua"
        ],
        "pause": 0.7,
        "tts": "Nitrogen dan oksigen juga memakai hibrida yang mirip es pe tiga, tapi tidak semua hibridanya dipakai berikatan."
      },
      {
        "text": "Pada amonia, satu hibrida berisi pasangan elektron bebas. Pada air, ada dua.",
        "hl": [
          "pasangan elektron bebas"
        ],
        "pause": 0.7
      },
      {
        "text": "Pasangan bebas lebih gemuk dan lebih dekat ke inti, sehingga mendorong ikatan lainnya saling merapat.",
        "hl": [
          "saling merapat"
        ],
        "pause": 0.7
      },
      {
        "text": "Sudut metana seratus sembilan koma lima, amonia sekitar seratus tujuh, dan air seratus empat koma lima derajat.",
        "hl": [
          "seratus empat koma lima derajat"
        ],
        "pause": 0.7
      },
      {
        "text": "Sudut yang membengkok inilah yang membuat air polar, dan memberi air banyak sifat istimewanya.",
        "hl": [
          "polar"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "shapes",
    "chapter": "13",
    "title": "Meramal bentuk molekul",
    "mood": "bright",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Hibridisasi memberi kita cara cepat menebak bentuk molekul.",
        "hl": [
          "menebak bentuk molekul"
        ],
        "pause": 0.7
      },
      {
        "text": "Boron trifluorida: boron membentuk tiga ikatan tanpa pasangan bebas, hibrida sp dua, segitiga datar.",
        "hl": [
          "segitiga datar"
        ],
        "pause": 0.7,
        "tts": "Boron trifluorida: boron membentuk tiga ikatan tanpa pasangan bebas, hibrida es pe dua, segitiga datar."
      },
      {
        "text": "Karbon dioksida: karbon dengan dua ikatan rangkap dua, hibrida sp, lurus.",
        "hl": [
          "lurus"
        ],
        "pause": 0.7,
        "tts": "Karbon dioksida: karbon dengan dua ikatan rangkap dua, hibrida es pe, lurus."
      },
      {
        "text": "Metana, amonia, dan air: empat pasang elektron di sekitar atom pusat, hibrida sp tiga, berturut-turut tetrahedral, piramida, dan bengkok.",
        "hl": [
          "tetrahedral, piramida, dan bengkok"
        ],
        "pause": 0.7,
        "tts": "Metana, amonia, dan air: empat pasang elektron di sekitar atom pusat, hibrida es pe tiga, berturut-turut tetrahedral, piramida, dan bengkok."
      },
      {
        "text": "Hibridisasi adalah cara menggambarkan bentuk yang teramati, bukan penyebab bentuk itu. Bentuknya tetap diukur dari eksperimen.",
        "hl": [
          "bukan penyebab"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "benzene",
    "chapter": "14",
    "title": "Resonansi benzena",
    "mood": "wonder",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Benzena, C enam H enam: cincin enam karbon sp dua, masing-masing menyisakan satu orbital p.",
        "hl": [
          "Benzena"
        ],
        "pause": 0.7,
        "tts": "Benzena, ce enam ha enam: cincin enam karbon es pe dua, masing-masing menyisakan satu orbital pe."
      },
      {
        "text": "Kekulé menggambarnya dengan tiga ikatan rangkap berselang-seling. Tapi ada dua cara menaruh rangkapnya.",
        "hl": [
          "dua cara"
        ],
        "pause": 0.7,
        "tts": "Kekule menggambarnya dengan tiga ikatan rangkap berselang-seling. Tapi ada dua cara menaruh rangkapnya."
      },
      {
        "text": "Eksperimen menunjukkan keenam ikatan sama panjang, sekitar seratus tiga puluh sembilan pikometer, di antara tunggal dan rangkap.",
        "hl": [
          "sama panjang"
        ],
        "pause": 0.7
      },
      {
        "text": "Teori ikatan valensi menjelaskannya sebagai resonansi kedua struktur Kekulé.",
        "hl": [
          "resonansi"
        ],
        "pause": 0.7,
        "tts": "Teori ikatan valensi menjelaskannya sebagai resonansi kedua struktur Kekule."
      },
      {
        "text": "Hasilnya, benzena lebih stabil sekitar seratus lima puluh kilojoule per mol daripada satu struktur Kekulé saja.",
        "hl": [
          "lebih stabil"
        ],
        "pause": 0.9,
        "tts": "Hasilnya, benzena lebih stabil sekitar seratus lima puluh kilojoule per mol daripada satu struktur Kekule saja."
      }
    ]
  },
  {
    "id": "carbon",
    "chapter": "15",
    "title": "Intan, grafit, grafena",
    "mood": "bright",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Hibridisasi yang sama menentukan wujud unsur karbon.",
        "hl": [
          "wujud unsur karbon"
        ],
        "pause": 0.7
      },
      {
        "text": "Pada intan, setiap karbon sp tiga terikat ke empat tetangga dalam jaringan tetrahedral. Hasilnya bahan alami terkeras, dan penyekat listrik.",
        "hl": [
          "intan"
        ],
        "pause": 0.7,
        "tts": "Pada intan, setiap karbon es pe tiga terikat ke empat tetangga dalam jaringan tetrahedral. Hasilnya bahan alami terkeras, dan penyekat listrik."
      },
      {
        "text": "Pada grafit, karbon sp dua membentuk lembaran heksagonal. Orbital p yang tersisa menyatu menjadi lautan elektron pi.",
        "hl": [
          "grafit"
        ],
        "pause": 0.7,
        "tts": "Pada grafit, karbon es pe dua membentuk lembaran heksagonal. Orbital pe yang tersisa menyatu menjadi lautan elektron pi."
      },
      {
        "text": "Elektron pi bebas bergerak di sepanjang lembaran, jadi grafit menghantarkan listrik, dan lembarannya mudah bergeser.",
        "hl": [
          "menghantarkan listrik"
        ],
        "pause": 0.7
      },
      {
        "text": "Satu lembar grafit saja disebut grafena, dipisahkan pada tahun dua ribu empat dan diganjar Nobel Fisika dua ribu sepuluh.",
        "hl": [
          "grafena"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "polymer",
    "chapter": "16",
    "title": "Plastik yang menghantarkan listrik",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Polietilena, plastik kantong belanja, adalah rantai karbon sp tiga. Semua elektronnya terkunci di ikatan sigma: penyekat.",
        "hl": [
          "penyekat"
        ],
        "pause": 0.7,
        "tts": "Polietilena, plastik kantong belanja, adalah rantai karbon es pe tiga. Semua elektronnya terkunci di ikatan sigma: penyekat."
      },
      {
        "text": "Poliasetilena berbeda: rantai karbon sp dua dengan ikatan tunggal dan rangkap berselang-seling, ikatan terkonjugasi.",
        "hl": [
          "terkonjugasi"
        ],
        "pause": 0.7,
        "tts": "Poliasetilena berbeda: rantai karbon es pe dua dengan ikatan tunggal dan rangkap berselang-seling, ikatan terkonjugasi."
      },
      {
        "text": "Setelah diberi sedikit iodin, elektron pi-nya dapat mengalir, dan plastik itu menghantarkan listrik seperti logam.",
        "hl": [
          "menghantarkan listrik seperti logam"
        ],
        "pause": 0.7
      },
      {
        "text": "Penemuan ini diganjar Nobel Kimia tahun dua ribu. Polimer penghantar sejenis kini dipakai, misalnya di lapisan layar OLED.",
        "hl": [
          "Nobel Kimia"
        ],
        "pause": 0.7,
        "tts": "Penemuan ini diganjar Nobel Kimia tahun dua ribu. Polimer penghantar sejenis kini dipakai, misalnya di lapisan layar o-led."
      }
    ]
  },
  {
    "id": "oxygen",
    "chapter": "17",
    "title": "Kegagalan oksigen",
    "mood": "tension",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Teori ikatan valensi sangat berhasil. Tapi coba satu molekul sederhana: oksigen, O dua.",
        "hl": [
          "oksigen"
        ],
        "pause": 0.7,
        "tts": "Teori ikatan valensi sangat berhasil. Tapi coba satu molekul sederhana: oksigen, o dua."
      },
      {
        "text": "Struktur Lewis dan ikatan valensi memberi O sama dengan O: satu sigma, satu pi, dan semua elektron berpasangan.",
        "hl": [
          "semua elektron berpasangan"
        ],
        "pause": 0.7,
        "tts": "Struktur Lewis dan ikatan valensi memberi o sama dengan o: satu sigma, satu pi, dan semua elektron berpasangan."
      },
      {
        "text": "Kalau semua berpasangan, oksigen seharusnya tidak tertarik magnet.",
        "hl": [
          "tidak tertarik magnet"
        ],
        "pause": 0.7
      },
      {
        "text": "Tapi tuang oksigen cair di antara kutub magnet kuat, dan cairan itu menggantung, menempel di kutub.",
        "hl": [
          "menggantung"
        ],
        "pause": 0.7
      },
      {
        "text": "Oksigen paramagnetik: ia punya dua elektron tak berpasangan, keadaan dasarnya triplet.",
        "hl": [
          "paramagnetik"
        ],
        "pause": 0.7
      },
      {
        "text": "Teori ikatan valensi tidak bisa menjelaskannya. Untuk itu kita butuh cara pandang baru: orbital molekul.",
        "hl": [
          "orbital molekul"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "recap",
    "chapter": "18",
    "title": "Merangkai semuanya",
    "mood": "resolve",
    "lead": 1.0,
    "tail": 2.4,
    "lines": [
      {
        "text": "Mari rangkum.",
        "pause": 0.6
      },
      {
        "text": "Ikatan kovalen lahir dari efek pertukaran: elektron menumpuk di antara dua inti.",
        "hl": [
          "efek pertukaran"
        ],
        "pause": 0.7
      },
      {
        "text": "Pauli menuntut kedua spin berlawanan. Itulah asal pasangan elektron.",
        "hl": [
          "spin berlawanan"
        ],
        "pause": 0.7
      },
      {
        "text": "Ikatan sigma dari tumpang tindih ujung, ikatan pi dari samping.",
        "hl": [
          "sigma",
          "pi"
        ],
        "pause": 0.7
      },
      {
        "text": "Hibrida sp tiga, sp dua, dan sp memberi sudut seratus sembilan koma lima, seratus dua puluh, dan seratus delapan puluh derajat.",
        "hl": [
          "Hibrida"
        ],
        "pause": 0.7,
        "tts": "Hibrida es pe tiga, es pe dua, dan es pe memberi sudut seratus sembilan koma lima, seratus dua puluh, dan seratus delapan puluh derajat."
      },
      {
        "text": "Resonansi menjelaskan benzena, dan hibridisasi menjelaskan intan, grafit, dan plastik penghantar.",
        "hl": [
          "Resonansi"
        ],
        "pause": 0.7
      },
      {
        "text": "Tapi oksigen yang tertarik magnet menunggu jawaban. Sampai jumpa di video orbital molekul.",
        "hl": [
          "orbital molekul"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "outro",
    "chapter": "",
    "title": "Penutup",
    "mood": "outro",
    "fixed": 15,
    "lines": []
  }
];
