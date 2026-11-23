export enum AssessmentPages {
  PHYSICAL_ACTIVITY_READINESS = "PHYSICAL_ACTIVITY_READINESS",
  PHYSIOLOGY_CONDITION_ASSESSMENT = "PHYSIOLOGY_CONDITION_ASSESSMENT",
  POSTURE_ASSESSMENT = "POSTURE_ASSESSMENT",
  MOVEMENT_ANALYSIS = "MOVEMENT_ANALYSIS",
  PHYSICAL_TESTS = "PHYSICAL_TESTS",
  GOAL_SETTING = "GOAL_SETTING",
}

const CONTROL =
  "Do you have difficulty controlling your condition with medications or other physician-prescribed therapies? (Answer NO if you are not currently taking medications or other treatments)";
const PARQ_FOLLOW_UPS: [string, string[]][] = [
  [
    "1. Do you have Arthritis, Osteoporosis, or Back Problems?",
    [
      `1a. ${CONTROL}`,
      "1b. Do you have joint problems causing pain, a recent fracture or fracture caused by osteoporosis or cancer, displaced vertebra (e.g., spondylolisthesis), and/or spondylolysis/pars defect (a crack in the bony ring on the back of the spinal column)?",
      "1c. Have you had steroid injections or taken steroid tablets regularly for more than 3 months?",
    ],
  ],
  [
    "2. Do you currently have Cancer of any kind?",
    [
      "2a. Does your cancer diagnosis include any of the following types: lung/bronchogenic, multiple myeloma (cancer of plasma cells), head, and/or neck?",
      "2b. Are you currently receiving cancer therapy (such as chemotherapy or radiotherapy)?",
    ],
  ],
  [
    "3. Do you have a Heart or Cardiovascular Condition? This includes Coronary Artery Disease, Heart Failure, Diagnosed Abnormality of Heart Rhythm",
    [
      `3a. ${CONTROL}`,
      "3b. Do you have an irregular heart beat that requires medical management? (e.g., atrial fibrillation, premature ventricular contraction)",
      "3c. Do you have chronic heart failure?",
      "3d. Do you have diagnosed coronary artery (cardiovascular) disease and have not participated in regular physical activity in the last 2 months?",
    ],
  ],
  [
    "4. Do you currently have High Blood Pressure?",
    [
      `4a. ${CONTROL}`,
      "4b. Do you have a resting blood pressure equal to or greater than 160/90 mmHg with or without medication? (Answer YES if you do not know your resting blood pressure)",
    ],
  ],
  [
    "5. Do you have any Metabolic Conditions? This includes Type 1 Diabetes, Type 2 Diabetes, Pre-Diabetes",
    [
      "5a. Do you often have difficulty controlling your blood sugar levels with foods, medications, or other physician-prescribed therapies?",
      "5b. Do you often suffer from signs and symptoms of low blood sugar (hypoglycemia) following exercise and/or during activities of daily living? Signs of hypoglycemia may include shakiness, nervousness, unusual irritability, abnormal sweating, dizziness or light-headedness, mental confusion, difficulty speaking, weakness, or sleepiness.",
      "5c. Do you have any signs or symptoms of diabetes complications such as heart or vascular disease and/or complications affecting your eyes, kidneys, OR the sensation in your toes and feet?",
      "5d. Do you have other metabolic conditions (such as current pregnancy-related diabetes, chronic kidney disease, or liver problems)?",
      "5e. Are you planning to engage in what for you is unusually high (or vigorous) intensity exercise in the near future?",
    ],
  ],
  [
    "6. Do you have any Mental Health Problems or Learning Difficulties? This includes Alzheimer's, Dementia, Depression, Anxiety Disorder, Eating Disorder, Psychotic Disorder, Intellectual Disability, Down Syndrome",
    [
      `6a. ${CONTROL}`,
      "6b. Do you have Down Syndrome AND back problems affecting nerves or muscles?",
    ],
  ],
  [
    "7. Do you have a Respiratory Disease? This includes Chronic Obstructive Pulmonary Disease, Asthma, Pulmonary High Blood Pressure",
    [
      `7a. ${CONTROL}`,
      "7b. Has your doctor ever said your blood oxygen level is low at rest or during exercise and/or that you require supplemental oxygen therapy?",
      "7c. If asthmatic, do you currently have symptoms of chest tightness, wheezing, laboured breathing, consistent cough (more than 2 days/week), or have you used your rescue medication more than twice in the last week?",
      "7d. Has your doctor ever said you have high blood pressure in the blood vessels of your lungs?",
    ],
  ],
  [
    "8. Do you have a Spinal Cord Injury? This includes Tetraplegia and Paraplegia",
    [
      `8a. ${CONTROL}`,
      "8b. Do you commonly exhibit low resting blood pressure significant enough to cause dizziness, light-headedness, and/or fainting?",
      "8c. Has your physician indicated that you exhibit sudden bouts of high blood pressure (known as Autonomic Dysreflexia)?",
    ],
  ],
  [
    "9. Have you had a Stroke? This includes Transient Ischemic Attack (TIA) or Cerebrovascular Event",
    [
      `9a. ${CONTROL}`,
      "9b. Do you have any impairment in walking or mobility?",
      "9c. Have you experienced a stroke or impairment in nerves or muscles in the past 6 months?",
    ],
  ],
  [
    "10. Do you have any other medical condition not listed above or do you have two or more medical conditions?",
    [
      "10a. Have you experienced a blackout, fainted, or lost consciousness as a result of a head injury within the last 12 months OR have you had a diagnosed concussion within the last 12 months?",
      "10b. Do you have a medical condition that is not listed (such as epilepsy, neurological conditions, kidney problems)?",
      "10c. Do you currently live with two or more medical conditions?",
    ],
  ],
];

type QType = "BOOL" | "BOOL_TEXT" | "TEXT";
const LIFESTYLE_QUESTIONS: [string, [string, QType][]][] = [
  [
    "Personal Information",
    [
      ["Age", "TEXT"],
      ["Gender", "TEXT"],
      ["Height", "TEXT"],
      ["Weight", "TEXT"],
      ["Physician Name and Phone Number", "TEXT"],
      ["Emergency Contact Name and Phone Number", "TEXT"],
    ],
  ],
  [
    "Exercise",
    [
      [
        "What exercise activities do you currently take part in (e.g., running, weightlifting, group exercise, etc.)?",
        "TEXT",
      ],
      [
        "How many days per week do you get at least 60 minutes of moderate-intensity exercise?",
        "TEXT",
      ],
      ["On a scale of 0 to 10, how important is weight loss to you?", "TEXT"],
      ["On a scale of 0 to 10, how important is muscle gain to you?", "TEXT"],
      [
        "On a scale of 0 to 10, how important is sports performance to you?",
        "TEXT",
      ],
      [
        "On a scale of 0 to 10, how important is health improvement to you?",
        "TEXT",
      ],
    ],
  ],
  [
    "Diet",
    [
      [
        "On a scale of 0 to 10, do you consider your overall diet to be healthy?",
        "TEXT",
      ],
      [
        "Are you currently following any kind of diet? If so, what diet and for what reason(s)?",
        "BOOL_TEXT",
      ],
      [
        "How would you rank your daily salt intake: low, medium, or high?",
        "TEXT",
      ],
      [
        "How would you rank your daily sugar intake: low, medium, or high?",
        "TEXT",
      ],
      [
        "How would you rank your daily fat intake: low, medium, or high?",
        "TEXT",
      ],
      [
        "On a scale of 0 to 10, how effectively are you able to control your temptations for junk food?",
        "TEXT",
      ],
      ["How many alcoholic drinks do you consume per week?", "TEXT"],
      [
        "Do you consume caffeinated beverages such as coffee, tea, soda, and/or energy drinks? How many per week?",
        "BOOL_TEXT",
      ],
    ],
  ],
  [
    "Lifestyle",
    [
      [
        "Do you feel like you get enough sleep and wake up feeling rested each day?",
        "TEXT",
      ],
      [
        "On a scale of 0 to 10, how would you rate your average level of stress?",
        "TEXT",
      ],
      [
        "What techniques do you currently use to manage your stress levels?",
        "TEXT",
      ],
      ["Do you smoke tobacco or use a vaporizer alternative?", "BOOL"],
    ],
  ],
  [
    "Occupation",
    [
      ["What is your occupation?", "TEXT"],
      [
        "Does your occupation require extended periods of sitting? (If YES, please explain.)",
        "BOOL_TEXT",
      ],
      [
        "Does your occupation require repetitive movements? (If YES, please explain.)",
        "BOOL_TEXT",
      ],
      [
        "Does your occupation require you to wear shoes with a heel (e.g., dress shoes, work boots)?",
        "BOOL",
      ],
    ],
  ],
  [
    "Recreation",
    [
      [
        "Do you partake in any recreational physical activities (golf, skiing, etc.)? (If YES, please explain.)",
        "BOOL_TEXT",
      ],
      [
        "Do you have any additional hobbies (gardening, fishing, music, etc.)? (If YES, please explain.)",
        "BOOL_TEXT",
      ],
    ],
  ],
  [
    "Medical",
    [
      ["Please list out any past musculoskeletal injuries", "TEXT"],
      ["Please list out any past surgeries", "TEXT"],
      [
        "If you have experienced injuries or surgeries, were they properly rehabilitated and did you receive clearance from a doctor to return to physical activity?",
        "TEXT",
      ],
      [
        "Do you have any chronic health conditions (such as, but not limited to, cardiovascular disease, pulmonary disorders, hypertension, diabetes, or cancer)? (If YES, please explain.)",
        "BOOL_TEXT",
      ],
      [
        "Are you on any medications, and if so, have you received clearance from your doctor to take part in physical activity?",
        "TEXT",
      ],
      ["Additional Notes", "TEXT"],
    ],
  ],
];

// Static Posture & Clinical Foot Integrity Assessment (ACSM). Client ID/name/DOB/age/timestamp
// skipped, app already has them. Modules 1-3 are trainer-only; members see 4 & 5.
const LAT = ["Left", "Right", "Bilateral"];
const SEV = ["Normal", "Mild", "Moderate", "Severe"];
const multi = (options: string[]) => ({ type: "CHOICE" as const, options });
const one = (options: string[]) => ({
  type: "CHOICE" as const,
  options,
  single: true,
});
const text = { type: "TEXT" as const };
type PostureValue =
  | ReturnType<typeof multi>
  | ReturnType<typeof one>
  | typeof text;
const POSTURE: [string, boolean, [string, PostureValue][]][] = [
  [
    "Module 1: Client Metadata & Pre-Assessment",
    true,
    [
      ["Evaluator & title", text],
      [
        "Biological sex (critical for knee Q-angle evaluation)",
        one(["Male", "Female"]),
      ],
      ["Chief complaint / goals", text],
      [
        "Pre-assessment readiness checklist (all items must be checked to begin)",
        multi([
          "Form-fitting attire verified: form-fitting shorts/yoga pants and a tank top so bony landmarks are visible",
          "Barefoot condition verified: shoes and socks removed to observe medial longitudinal arch integrity",
          "Natural posture induced: 2-3 mini-squats then a natural, relaxed standing stance",
          "Plumb line / grid calibrated: aligned vertically with the camera or examiner line of sight",
        ]),
      ],
    ],
  ],
  [
    "Module 2: Anterior View Inspection",
    true,
    [
      [
        "Feet & ankles: deviations (ideal: toes pointing straight forward; medial longitudinal arch intact and bilaterally symmetrical)",
        multi([
          "Pes planus (flat foot / medial arch collapse)",
          "Forefoot abduction (toes-out stance)",
          "Pes cavus (high arch)",
        ]),
      ],
      [
        "Feet & ankles: laterality (required if a deviation is selected)",
        one(LAT),
      ],
      ["Feet & ankles: severity", one(SEV)],
      ["Feet & ankles: clinical notes (arch eversion)", text],
      [
        "Lower leg (tibia & fibula): deviations (ideal: tibia perpendicular to the ground with zero internal rotation)",
        multi(["Tibial internal rotation", "Tibial external rotation"]),
      ],
      ["Lower leg: laterality (required if a deviation is selected)", one(LAT)],
      ["Lower leg: clinical notes (tibial torsion)", text],
      [
        "Knees (patella alignment): deviations (ideal: patella facing directly forward, in line with the 2nd and 3rd toes)",
        multi([
          "Knee valgus (knock-kneed / medial displacement)",
          "Knee varus (bow-legged / lateral displacement)",
        ]),
      ],
      ["Knees: laterality (required if a deviation is selected)", one(LAT)],
      ["Knees: severity", one(SEV)],
      ["Knees: clinical notes (Q-angle and patellar tracking)", text],
      [
        "Pelvis & lumbopelvic complex (ASIS): deviations (ideal: ASIS level horizontally in the frontal plane)",
        multi([
          "Pelvic elevation (asymmetric ASIS height)",
          "Lateral pelvic tilt (side shift)",
        ]),
      ],
      ["Pelvis: elevated side", one(["Left higher", "Right higher"])],
      ["Pelvis: clinical notes (pelvic asymmetry)", text],
    ],
  ],
  [
    "Module 3: Lateral View Inspection",
    true,
    [
      [
        "Knee joint alignment",
        one([
          "Neutral knee alignment (normal)",
          "Knee hyperextension (genu recurvatum)",
          "Flexed knee stance",
        ]),
      ],
      ["Knee joint: notes on joint hyperextension or flexed posture", text],
      [
        "Pelvis & pelvic tilt",
        one([
          "Neutral pelvic position",
          "Excessive anterior pelvic tilt (PSIS significantly higher than ASIS)",
          "Posterior pelvic tilt (flat pelvis)",
        ]),
      ],
      [
        "Pelvic tilt: notes on pelvic inclination and hip flexor tightness",
        text,
      ],
      [
        "Lumbar spine curve",
        one([
          "Neutral lordosis",
          "Excessive lumbar lordosis",
          "Flat lumbar spine",
        ]),
      ],
      ["Lumbar spine: notes on lumbar curve depth and abdominal tone", text],
      [
        "Thoracic spine curve",
        one([
          "Neutral kyphosis",
          "Excessive thoracic kyphosis (hunchback)",
          "Flat thoracic spine",
        ]),
      ],
      ["Thoracic spine: notes on thoracic mobility restriction", text],
      [
        "Shoulder complex: deviations",
        multi(["Protracted / rounded shoulders", "Internal shoulder rotation"]),
      ],
      ["Shoulder complex: severity", one(SEV)],
      [
        "Shoulder complex: notes on scapular protraction and pectoralis tightness",
        text,
      ],
      [
        "Head & neck position",
        one(["Neutral head alignment", "Forward head posture (FHP)"]),
      ],
      ["Head & neck: forward displacement (cm)", text],
      [
        "Head & neck: notes on suboccipital and upper trapezius tightness",
        text,
      ],
    ],
  ],
  [
    "Module 4: Findings and Conclusion",
    false,
    [
      ["Key clinical findings: foot, ankle & knee segment", text],
      ["Key clinical findings: pelvic & lumbar segment", text],
      ["Key clinical findings: thoracic, shoulder & head segment", text],
      [
        "Final kinesiological diagnosis, working hypotheses & clinical impression",
        text,
      ],
    ],
  ],
  [
    "Module 5: Corrective Exercise Program",
    false,
    [
      [
        "Overactive muscles (inhibit & lengthen; e.g. soleus, gastrocnemius, adductors, hip flexors, pectoralis major/minor): myofascial release and static stretching protocols",
        text,
      ],
      [
        "Underactive muscles (activate & strengthen; e.g. tibialis anterior, gluteus maximus, middle/lower trapezius, rhomboids): positional activation and isolated strengthening protocols",
        text,
      ],
    ],
  ],
];

export const PARQ_DECLARATION = {
  en: "Declaration",
  options: [
    "I have read, understood and completed this questionnaire truthfully. I acknowledge this clearance is valid for 12 months (or until my condition changes) and that MFC may keep a confidential copy for its records.",
  ],
};

export const QUESTION_META = [
  {
    section: 1,
    subtitle: "Kesiapan Aktivitas Fisik",
    data: [
      ...[
        "MFC TERM & CONDITION: I have read, understood, and agree to follow all MFC Term & condition.",
        "MFC Gym/Private/Class/CAMP Rules: I have read, understood, and agree to follow all rules and etiquette guidelines.",
        "Equipment Use: I understand that I must use all gym equipment properly and at my own risk.",
        "Hygiene & Attire: I agree to wipe down equipment after use and wear appropriate closed-toe athletic shoes and attire.",
        "Re-racking Weights: I commit to re-rack all dumbbells, plates, and attachments in their proper places after use.",
      ].map((en) => ({
        group: "Member Acknowledgment",
        key: { en, id: "" },
        value: {
          type: "BOOL" as const,
          noHint:
            "Please check MFC Term & condition in your profile app on upper right corner or talk to the customer service at the front desk before proceed",
        },
      })),
      ...(
        [
          [
            "What should you do immediately after finishing with a bench or machine?",
            [
              "Leave it for the next person",
              "Wipe it down with the provided sanitizer and towel",
              "Spray sanitizer directly onto the machine console",
            ],
          ],
          [
            "Where do dumbbells and weight plates belong when you are done?",
            [
              "Left on the floor next to the bench",
              "Stacked in a corner",
              "Returned to their designated rack or tree",
            ],
          ],
          [
            'What is the proper protocol if you want to "work in" on a piece of equipment someone is using?',
            [
              "Jump in while they are mid-set",
              "Politely ask how many sets they have left before using it",
              "Move their water bottle to claim it",
            ],
          ],
          [
            "Are mobile phone video calls or loud speaker use permitted on the main gym floor?",
            [
              "Yes, anytime",
              "No, use headphones and step to the lobby for calls",
              "Only near the heavy lifting platforms",
            ],
          ],
          [
            "What is the proper protocol before entering a gym floor or class or facilities?",
            [
              "Say Hi and avoid check in",
              "Check In at the front desk and follow all fitness center procedures and etiquette",
              "Walk pass the front desk",
            ],
          ],
        ] as const
      ).map(([en, options]) => ({
        group: "Quick Comprehension Check",
        key: { en, id: "" },
        value: { type: "CHOICE" as const, options: [...options] },
      })),
      ...[
        "Has a doctor ever advised you of a heart condition that restricts physical activity?",
        "Do you experience chest pain during exertion or at rest?",
        "Do you suffer from balance issues, dizziness, or joint/bone problems that exercise could aggravate?",
      ].map((en) => ({
        group: "Pre-Exercise Health & Readiness Screening (PAR-Q)",
        key: { en, id: "" },
        value: { type: "BOOL" as const },
      })),
    ],
  },

  {
    section: "2A",
    subtitle: "PAR-Q+ Physical Activity Readiness",
    data: [
      ...(
        [
          [
            "1. Has your doctor ever said that you have a heart condition OR high blood pressure?",
            "BOOL",
          ],
          [
            "2. Do you feel pain in your chest at rest, during your daily activities of living, OR when you do physical activity?",
            "BOOL",
          ],
          [
            "3. Do you lose balance because of dizziness OR have you lost consciousness in the last 12 months? (Answer NO if your dizziness was associated with over-breathing, including during vigorous exercise)",
            "BOOL",
          ],
          [
            "4. Have you ever been diagnosed with another chronic medical condition (other than heart disease or high blood pressure)? Please list condition(s)",
            "BOOL_TEXT",
          ],
          [
            "5. Are you currently taking prescribed medications for a chronic medical condition? Please list condition(s) and medications",
            "BOOL_TEXT",
          ],
          [
            "6. Do you currently have (or have had within the past 12 months) a bone, joint, or soft tissue (muscle, ligament, or tendon) problem that could be made worse by becoming more physically active? (Answer NO if you had a problem in the past, but it does not limit your current ability to be physically active) Please list condition(s)",
            "BOOL_TEXT",
          ],
          [
            "7. Has your doctor ever said that you should only do medically supervised physical activity?",
            "BOOL",
          ],
        ] as const
      ).map(([en, type]) => ({
        group: "General Health Questions",
        key: { en, id: "" },
        value: { type },
      })),
      // ponytail: follow-ups show only when their parent is YES, not gated on page-1 answers
      ...PARQ_FOLLOW_UPS.flatMap(([parent, subs]) => [
        {
          group: "Follow-up Questions About Your Medical Condition(s)",
          key: { en: parent, id: "" },
          value: { type: "BOOL" as const },
        },
        ...subs.map((en) => ({
          group: "Follow-up Questions About Your Medical Condition(s)",
          parent,
          key: { en, id: "" },
          value: { type: "BOOL" as const },
        })),
      ]),
      {
        group: "Follow-up Questions About Your Medical Condition(s)",
        parent: PARQ_FOLLOW_UPS[PARQ_FOLLOW_UPS.length - 1][0],
        key: {
          en: "Please list your medical condition(s) and any related medications",
          id: "",
        },
        value: { type: "TEXT" as const },
      },
      // PAR-Q+ signature replaced by a checklist; detail.tsx requires every box
      {
        group: "Declaration",
        key: { en: PARQ_DECLARATION.en, id: "" },
        value: { type: "CHOICE" as const, options: PARQ_DECLARATION.options },
      },
    ],
  },

  // 2A and 2B are separate sections so the web admin shows them apart
  {
    section: "2B",
    subtitle: "Lifestyle & Health History",
    data: [
      // NASM Lifestyle and Health History Questionnaire (name/date skipped, app already has them)
      ...LIFESTYLE_QUESTIONS.flatMap(([group, qs]) =>
        qs.map(([en, type]) => ({
          group,
          key: { en, id: "" },
          value: { type },
        })),
      ),
    ],
  },

  {
    section: 3,
    subtitle: "Static Posture & Clinical Foot Integrity Assessment",
    data: POSTURE.flatMap(([group, trainerOnly, qs]) =>
      qs.map(([en, value]) => ({
        group,
        ...(trainerOnly && { trainerOnly }),
        key: { en, id: "" },
        value,
      })),
    ),
  },
];
