export const assessmentAnswer = {
  PHYSICAL_ACTIVITY_READINESS: {
    client_name: "Alexander Justine Santiago",
    age: 23,
    date: "2026-02-23",
    answers: {
      heart_condition: {
        value: false,
        detail: "",
      },
      chest_pain_exercise: {
        value: false,
        detail: "",
      },
      chest_pain_rest: {
        value: false,
        detail: "",
      },
      dizziness: {
        value: false,
        detail: "",
      },
      bone_joint_problem: {
        value: false,
        detail: "",
      },
      cardiovascular_medication: {
        value: false,
        detail: "",
      },
      other_reasons_not_to_exercise: {
        value: false,
        detail: "",
      },
      past_injury: {
        value: true,
        detail: "Mild ankle sprain during futsal in 2023, fully recovered",
      },
      recovering_from_injury: {
        value: false,
        detail: "",
      },
      visited_physiotherapist: {
        value: true,
        detail: "Post ankle sprain mobility therapy",
      },
      surgery_last_year: {
        value: false,
        detail: "",
      },
      hospitalized_before: {
        value: true,
        detail: "Dengue fever in 2022",
      },
      other_conditions: {
        value: false,
        detail: "",
      },
      pregnancy_related: {
        value: false,
        detail: "",
      },
      other_therapies: {
        value: false,
        detail: "",
      },
      allergies: {
        value: true,
        detail: "Mild shrimp allergy",
      },
      medication_effect: { text: "" },
      medication_list: { text: "" },
      fitness_supplements: {
        text: "Whey protein, Creatine monohydrate, Multivitamin",
      },
    },
  },
  PHYSIOLOGY_CONDITION_ASSESSMENT: {
    resting_heart_rate_bpm: 68,
    blood_pressure: {
      systolic: 118,
      diastolic: 76,
    },
    body_composition: {
      height_cm: 175,
      weight_kg: 72,
      body_fat_percent: 17.5,
      muscle_mass_kg: 33.2,
      bmi: 23.5,
    },
    segmental_fat: {
      left_arm: 1.2,
      right_arm: 1.3,
      trunk: 8.4,
      left_leg: 3.5,
      right_leg: 3.6,
    },
    segmental_muscle: {
      left_arm: 3.8,
      right_arm: 3.9,
      trunk: 26.4,
      left_leg: 9.8,
      right_leg: 9.9,
    },
    obesity_analysis: {
      category: "Normal",
    },
    circumference_cm: {
      chest: 98,
      waist: 82,
      hips: 95,
      thigh: 54,
      calf: 36,
      upper_arm: 32,
    },
    total_body_water_liters: 43.5,
  },
  POSTURE_ASSESSMENT: {
    anterior_view: {
      head: "Neutral",
      upper_back: "Normal",
      shoulders: "Slightly rounded",
      pelvis: "Neutral",
      q_angle: "Normal",
      knees: "Normal",
      feet: "Slight pronation",
    },
    lateral_view: {
      posture: "Mild forward head posture",
    },
    posterior_view: {
      symmetry: "Slight right shoulder elevation",
    },
    movement_dysfunction: [
      "Forward head posture",
      "Mild upper crossed syndrome",
    ],
  },
  MOVEMENT_ANALYSIS: {
    squat: {
      air_squat_test: "Pass",
      overhead_squat_test: "Knees slightly inward",
      weight_squat_test: "Stable with light load",
    },
    lunge: {
      front_lunges: "Good balance",
      back_lunges: "Stable",
      walking_lunges: "Slight knee wobble",
    },
    hinge: {
      hip_hinge_test: "Good",
      romanian_deadlift_test: "Hamstring tightness",
      single_deadlift_test: "Moderate stability",
    },
    push: {
      push_up_test: "25 reps",
      bench_press_test: "60 kg x 8 reps",
      overhead_press_test: "35 kg x 6 reps",
    },
    pull: {
      pull_up_test: "8 reps",
      seated_row: "Good control",
      bent_over_row: "Slight lower back rounding",
    },
    core_stability: {
      plank_test_seconds: 95,
      side_plank_seconds: 60,
      dead_bug_test: "Good control",
    },
    rotate: {
      rotation_control: "Normal",
    },
  },
  PHYSICAL_TESTs: {
    cardiovascular_fitness: {
      rockport_walk: {
        time_minutes: 13.2,
        vo2_estimate: 46,
      },
    },
    aerobic_engine: {
      cooper_run_12_min_distance_m: 2400,
      maf_air_bike_20_min_calories: 210,
      row_2000m_time: "8:10",
    },
    anaerobic_capacity: {
      ski_erg_30s_watts: 420,
    },
    muscle_endurance: {
      push_up_1_min: 38,
      squat_test: 55,
      plank_shoulder_taps: 72,
    },
    muscle_fitness: {
      estimated_1rm_bench_press: 82,
      estimated_1rm_squat: 120,
      estimated_1rm_deadlift: 140,
    },
  },
  GOAL_SETTING: {
    name: "Alexander Justine Santiago",
    coach_name: "Michael Tan",
    date: "2026-02-23",
    primary_goals: {
      gain_muscle: "Increase lean muscle mass",
      lose_weight: "",
      get_fit: "Improve overall health and stamina",
      endurance: "Run 5km comfortably",
      strength_toning: "Improve body definition",
      power: "",
      increase_flexibility: "Reduce hamstring tightness",
      improve_mobility: "Better hip mobility",
      nutrition_diet: "Higher protein balanced diet",
      others: "",
    },
    target_body_parts: {
      legs: "Increase quad and hamstring strength",
      arms: "Biceps and triceps definition",
      glutes: "Stronger glutes",
      abs: "Visible abs",
      chest: "Bigger chest",
      back: "Wider lats",
      others: "",
    },
    top_three_goals: ["Build muscle", "Increase strength", "Improve endurance"],
    expected_results_time: "3 months",
    training_frequency_per_week: 4,
    short_term_goal: "Look fitter for vacation in 3 months",
    long_term_goal: "Maintain athletic physique and healthy lifestyle",
    preferred_training: [
      "Weight training",
      "Functional training",
      "Light cardio",
    ],
    disliked_training: ["Long treadmill running"],
    equipment_preference: "Free weights and machines",
    current_sports_activity: "Gym workouts and occasional futsal",
    routine_effectiveness: "Effective",
    fitness_knowledge_level: "Cukup berpengalaman",
    expectation_from_trainer: "Structured training program and accountability",
    preferred_coaching_style: "Motivational but relaxed",
    communication_frequency: "Weekly check-in",
    motivation_factor: "Seeing physical progress and improved strength",
    motivation_level: 4,
    past_obstacles: "Busy work schedule and inconsistent sleep",
    occupation_and_routine: "Software developer, sits 6-8 hours per day",
  },
};

export const assessmentQuestion = {
  PHYSICAL_ACTIVITY_READINESS: {
    questions: [
      {
        key: "heart_condition",
        en: "Do you have a diagnosed heart condition, and has a doctor ever said you should only follow an exercise program approved by a doctor?",
        id: "Apakah dokter Anda pernah mengatakan bahwa Anda memiliki kondisi jantung dan bahwa Anda hanya boleh melakukan aktivitas fisik yang direkomendasikan oleh dokter?",
        type: "boolean",
      },
      {
        key: "chest_pain_exercise",
        en: "Do you experience chest pain during exercise?",
        id: "Apakah Anda merasakan nyeri di dada saat melakukan aktivitas fisik?",
        type: "boolean",
      },
      {
        key: "chest_pain_rest",
        en: "Have you had any chest pain while at rest in the last month?",
        id: "Dalam sebulan terakhir, apakah Anda mengalami nyeri dada saat tidak melakukan aktivitas fisik?",
        type: "boolean",
      },
      {
        key: "dizziness",
        en: "Do you ever get dizzy and lose your balance? Have you ever lost consciousness as a result?",
        id: "Apakah Anda kehilangan keseimbangan karena pusing atau apakah Anda pernah kehilangan kesadaran?",
        type: "boolean",
      },
      {
        key: "bone_joint_problem",
        en: "Do you have bone or joint problems that get worse with exercise?",
        id: "Apakah Anda memiliki masalah tulang atau sendi (misalnya punggung, lutut atau pinggul) yang dapat diperburuk oleh perubahan aktivitas fisik Anda?",
        type: "boolean",
      },
      {
        key: "cardiovascular_medication",
        en: "If you have cardiovascular issues, does your doctor currently prescribe any medications?",
        id: "Apakah dokter Anda saat ini meresepkan obat (misalnya pil/air) untuk tekanan darah atau kondisi jantung Anda?",
        type: "boolean",
      },
      {
        key: "other_reasons_not_to_exercise",
        en: "Can you think of other reasons why you might not be able to exercise?",
        id: "Apakah Anda mengetahui alasan lain mengapa Anda tidak boleh melakukan aktivitas fisik?",
        type: "boolean",
      },
      {
        key: "past_injury",
        en: "Have you ever suffered an injury in the past? If so, what kind and how severe was it?",
        id: "Pernahkah Anda menderita cedera di masa lalu? Jika demikian, jenis apa dan seberapa parahnya?",
        type: "boolean",
      },
      {
        key: "recovering_from_injury",
        en: "Are you currently recovering from an injury or trauma?",
        id: "Apakah Anda saat ini pulih dari cedera atau trauma?",
        type: "boolean",
      },
      {
        key: "visited_physiotherapist",
        en: "Have you ever been to a physical therapist? If so, why?",
        id: "Pernahkah Anda ke terapis fisik? Jika demikian, mengapa?",
        type: "boolean",
      },
      {
        key: "surgery_last_year",
        en: "Have you undergone surgery in the last year?",
        id: "Apakah Anda telah menjalani operasi dalam setahun terakhir?",
        type: "boolean",
      },
      {
        key: "hospitalized_before",
        en: "Have you been hospitalized in the past? If so, why?",
        id: "Apakah Anda pernah dirawat di rumah sakit di masa lalu? Jika demikian, mengapa?",
        type: "boolean",
      },
      {
        key: "other_conditions",
        en: "Do you have any other conditions that could affect your ability to exercise?",
        id: "Apakah Anda memiliki kondisi lain yang dapat memengaruhi kemampuan Anda untuk berolahraga?",
        type: "boolean",
      },
      {
        key: "pregnancy_related",
        en: "Are you pregnant, or have you given birth in the last 12-18 months?",
        id: "Apakah Anda hamil, atau telah melahirkan dalam 12-18 bulan terakhir?",
        type: "boolean",
      },
      {
        key: "other_therapies",
        en: "Have you undergone any other therapies?",
        id: "Apakah Anda telah menjalani terapi lain?",
        type: "boolean",
      },
      {
        key: "allergies",
        en: "Do you have any known allergies or food sensitivities?",
        id: "Apakah Anda memiliki alergi atau sensitivitas makanan yang diketahui?",
        type: "boolean",
      },
      {
        key: "medications",
        en: "Do you currently take any medications?",
        id: "Apakah Anda saat ini mengonsumsi obat?",
        type: "boolean",
      },

      {
        key: "medication_list",
        en: "Medications",
        id: "Obat-obatan",
        type: "text",
      },
      {
        key: "medication_effect",
        en: "Effect",
        id: "Efek",
        type: "text",
      },
      {
        key: "fitness_supplements",
        en: "Fitness Supplements",
        id: "Suplemen",
        type: "text",
      },
    ],
  },

  PHYSIOLOGY_CONDITION_ASSESSMENT: {
    fields: [
      {
        en: "Resting Heart Rate (RHR)",
        id: "Denyut Jantung Istirahat",
      },
      {
        en: "Blood Pressure (BP)",
        id: "Tekanan darah",
      },
      {
        en: "Body Composition",
        id: "Komposisi Tubuh",
      },
      {
        en: "Segmental Fat Analysis",
        id: "Analisis Lemak Segmen",
      },
      {
        en: "Segmental Muscle Analysis",
        id: "Analisis Otot Segmen",
      },
      {
        en: "Obesity Analysis",
        id: "Analisis Obesitas",
      },
      {
        en: "Body Circumference Measurements",
        id: "Pengukuran Lingkaran Tubuh",
      },
      {
        en: "Total Body Water (TBW)",
        id: "Total Air Tubuh",
      },
    ],
  },

  POSTURE_ASSESSMENT: {
    views: {
      anterior: {
        en: "Anterior View",
        id: "Pandangan Anterior",
      },
      lateral: {
        en: "Lateral View",
        id: "Pandangan Lateral",
      },
      posterior: {
        en: "Posterior View",
        id: "Pandangan Posterior",
      },
    },
  },

  MOVEMENT_ANALYSIS: {
    categories: [
      { en: "Squat", id: "Squat" },
      { en: "Lunge", id: "Lunge" },
      { en: "Hinge", id: "Hinge" },
      { en: "Push", id: "Push" },
      { en: "Pull", id: "Pull" },
      { en: "Core Stability", id: "Stabilitas Core" },
      { en: "Rotation", id: "Rotasi" },
    ],
  },

  PHYSICAL_TEST: {
    tests: [
      {
        en: "Cardiovascular Fitness Test",
        id: "Tes Kebugaran Kardiovaskular",
      },
      {
        en: "Aerobic Engine Test",
        id: "Tes Aerobik",
      },
      {
        en: "Anaerobic Capacity Test",
        id: "Tes Kapasitas Anaerobik",
      },
      {
        en: "Muscle Endurance Test",
        id: "Tes Daya Tahan Otot",
      },
      {
        en: "Muscle Fitness Test",
        id: "Tes Kekuatan Otot",
      },
    ],
  },

  GOAL_SETTING: {
    questions: [
      {
        en: "What is your main training goal? Why?",
        id: "Apa tujuan utama latihan Anda? Alasan?",
      },
      {
        en: "Are there specific body parts you want to train?",
        id: "Apakah ada bagian tubuh tertentu yang ingin Anda latih?",
      },
      {
        en: "What are your top three fitness or nutrition goals?",
        id: "Apa tiga sasaran kebugaran atau nutrisi utama Anda?",
      },
      {
        en: "How long do you expect to see results?",
        id: "Berapa lama Anda memperkirakan akan melihat perubahan?",
      },
      {
        en: "How many times per week can you train?",
        id: "Berapa kali seminggu Anda bisa latihan?",
      },
      {
        en: "What motivates you to achieve your goals?",
        id: "Apa yang akan memotivasi Anda untuk mencapai tujuan Anda?",
      },
    ],
  },
};
