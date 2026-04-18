export const QUESTION_META = [
  {
    section: 1,
    subtitle: "Kesiapan Aktivitas Fisik — Jawab dengan jujur",
    data: [
      {
        key: {
          en: "Do you have a diagnosed heart condition, and has a doctor ever said you should only follow an exercise program approved by a doctor?",
          id: "Apakah dokter Anda pernah mengatakan bahwa Anda memiliki kondisi jantung dan bahwa Anda hanya boleh melakukan aktivitas fisik yang direkomendasikan oleh dokter?",
        },
        value: { type: "BOOL_TEXT" },
      },
      {
        key: {
          en: "Do you experience chest pain during exercise?",
          id: "Apakah Anda merasakan nyeri di dada saat melakukan aktivitas fisik?",
        },
        value: { type: "BOOL_TEXT" },
      },
      {
        key: {
          en: "Have you had any chest pain while at rest in the last month?",
          id: "Dalam sebulan terakhir, apakah Anda mengalami nyeri dada saat tidak melakukan aktivitas fisik?",
        },
        value: { type: "BOOL_TEXT" },
      },
      {
        key: {
          en: "Do you ever get dizzy and lose your balance? Have you ever lost consciousness as a result?",
          id: "Apakah Anda kehilangan keseimbangan karena pusing atau apakah Anda pernah kehilangan kesadaran?",
        },
        value: { type: "BOOL_TEXT" },
      },
      {
        key: {
          en: "Do you have bone or joint problems that get worse with exercise?",
          id: "Apakah Anda memiliki masalah tulang atau sendi (misalnya punggung, lutut atau pinggul) yang dapat diperburuk oleh perubahan aktivitas fisik Anda?",
        },
        value: { type: "BOOL_TEXT" },
      },
      {
        key: {
          en: "If you have cardiovascular issues, does your doctor currently prescribe any medications?",
          id: "Apakah dokter Anda saat ini meresepkan obat (misalnya pil/air) untuk tekanan darah atau kondisi jantung Anda?",
        },
        value: { type: "BOOL_TEXT" },
      },
      {
        key: {
          en: "Can you think of other reasons why you might not be able to exercise?",
          id: "Apakah Anda mengetahui alasan lain mengapa Anda tidak boleh melakukan aktivitas fisik?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Have you ever suffered an injury in the past? If so, what kind and how severe was it?",
          id: "Pernahkah Anda menderita cedera di masa lalu? Jika demikian, jenis apa dan seberapa parahnya?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Are you currently recovering from an injury or trauma?",
          id: "Apakah Anda saat ini pulih dari cedera atau trauma?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Have you ever been to a physical therapist? If so, why?",
          id: "Pernahkah Anda ke terapis fisik? Jika demikian, mengapa?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Have you undergone surgery in the last year?",
          id: "Apakah Anda telah menjalani operasi dalam setahun terakhir?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Have you been hospitalized in the past? If so, why?",
          id: "Apakah Anda pernah dirawat di rumah sakit di masa lalu? Jika demikian, mengapa?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Do you have any other conditions that could affect your ability to exercise?",
          id: "Apakah Anda memiliki kondisi lain yang dapat memengaruhi kemampuan Anda untuk berolahraga?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Are you pregnant, or have you given birth in the last 12-18 months?",
          id: "Apakah Anda hamil, atau telah melahirkan dalam 12-18 bulan terakhir?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Have you undergone any other therapies?",
          id: "Apakah Anda telah menjalani terapi lain?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Do you have any known allergies or food sensitivities?",
          id: "Apakah Anda memiliki alergi atau sensitivitas makanan yang diketahui?",
        },
        value: { type: "BOOL" },
      },
      {
        key: {
          en: "Do you currently take any medications?",
          id: "Apakah Anda saat ini mengonsumsi obat?",
        },
        value: { type: "BOOL" },
      },
      {
        key: { en: "Medications", id: "Obat-obatan" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Effect", id: "Efek" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Fitness Supplements", id: "Suplemen" },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "Harap Anda/Dokter sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:",
          id: "Harap Anda/Dokter sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:",
        },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "Harap Physiotherapist sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:",
          id: "Harap Physiotherapist sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:",
        },
        value: { type: "TEXT" },
      },
    ],
  },

  {
    section: 2,
    subtitle: "Penilaian Kondisi Fisiologis",
    data: [
      {
        key: { en: "Resting Heart Rate (RHR)", id: "Denyut Jantung Istirahat" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Blood Pressure (BP)", id: "Tekanan darah" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Body Composition", id: "Komposisi Tubuh" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Segmental Fat Analysis", id: "Analisis Lemak Segmen" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Segmental Muscle Analysis", id: "Analisis Otot Segmen" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Obesity Analysis", id: "Analisis Obesitas" },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "Body Circumference Measurements",
          id: "Pengukuran Lingkaran Tubuh",
        },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Total Body Water (TBW)", id: "Total Air Tubuh" },
        value: { type: "TEXT" },
      },
    ],
  },

  {
    section: 3,
    subtitle: "Evaluasi postur tubuh Anda",
    data: [
      {
        key: { en: "Anterior View", id: "Pandangan Anterior" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Lateral View", id: "Pandangan Lateral" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Posterior View", id: "Pandangan Posterior" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Movement Dysfunction", id: "Disfungsi Gerakan" },
        value: { type: "TEXT" },
      },
    ],
  },

  {
    section: 4,
    subtitle: "Analisis pola gerakan dasar",
    data: [
      { key: { en: "Squat", id: "Squat" }, value: { type: "TEXT" } },
      { key: { en: "Lunge", id: "Lunge" }, value: { type: "TEXT" } },
      { key: { en: "Hinge", id: "Hinge" }, value: { type: "TEXT" } },
      { key: { en: "Push", id: "Push" }, value: { type: "TEXT" } },
      { key: { en: "Pull", id: "Pull" }, value: { type: "TEXT" } },
      {
        key: { en: "Core Stability", id: "Stabilitas Core" },
        value: { type: "TEXT" },
      },
      { key: { en: "Rotation", id: "Rotasi" }, value: { type: "TEXT" } },
    ],
  },

  {
    section: 5,
    subtitle: "Tes kemampuan fisik",
    data: [
      {
        key: {
          en: "Cardiovascular Fitness Test",
          id: "Tes Kebugaran Kardiovaskular",
        },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Aerobic Engine Test", id: "Tes Aerobik" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Anaerobic Capacity Test", id: "Tes Kapasitas Anaerobik" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Muscle Endurance Test", id: "Tes Daya Tahan Otot" },
        value: { type: "TEXT" },
      },
      {
        key: { en: "Muscle Fitness Test", id: "Tes Kekuatan Otot" },
        value: { type: "TEXT" },
      },
    ],
  },

  {
    section: 6,
    subtitle: "Tentukan tujuan kebugaran Anda",
    data: [
      {
        key: {
          en: "What is your main training goal? Why?",
          id: "Apa tujuan utama latihan Anda? Alasan?",
        },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "Are there specific body parts you want to train?",
          id: "Apakah ada bagian tubuh tertentu yang ingin Anda latih?",
        },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "What are your top three fitness or nutrition goals?",
          id: "Apa tiga sasaran kebugaran atau nutrisi utama Anda?",
        },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "How long do you expect to see results?",
          id: "Berapa lama Anda memperkirakan akan melihat perubahan?",
        },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "How many times per week can you train?",
          id: "Berapa kali seminggu Anda bisa latihan?",
        },
        value: { type: "TEXT" },
      },
      {
        key: {
          en: "What motivates you to achieve your goals?",
          id: "Apa yang akan memotivasi Anda untuk mencapai tujuan Anda?",
        },
        value: { type: "TEXT" },
      },
    ],
  },
];
