export const PARSE_CONFIG: Record<string, { label: string; key: string }[]> = {
  "Body Composition": [
    { label: "Height", key: "height" },
    { label: "Weight", key: "weight" },
    { label: "Body Fat", key: "bodyFat" },
    { label: "Muscle Mass", key: "muscleMass" },
    { label: "BMI", key: "bmi" },
  ],

  "Segmental Fat Analysis": [
    { label: "Left Arm", key: "leftArm" },
    { label: "Right Arm", key: "rightArm" },
    { label: "Trunk", key: "trunk" },
    { label: "Left Leg", key: "leftLeg" },
    { label: "Right Leg", key: "rightLeg" },
  ],

  "Segmental Muscle Analysis": [
    { label: "Left Arm", key: "leftArm" },
    { label: "Right Arm", key: "rightArm" },
    { label: "Trunk", key: "trunk" },
    { label: "Left Leg", key: "leftLeg" },
    { label: "Right Leg", key: "rightLeg" },
  ],

  "Body Circumference Measurements": [
    { label: "Chest", key: "chest" },
    { label: "Waist", key: "waist" },
    { label: "Hips", key: "hips" },
    { label: "Thigh", key: "thigh" },
    { label: "Calf", key: "calf" },
    { label: "Arm", key: "arm" },
  ],

  "Anterior View": [
    { label: "Head", key: "head" },
    { label: "Upper Back", key: "upperBack" },
    { label: "Shoulders", key: "shoulders" },
    { label: "Pelvis", key: "pelvis" },
    { label: "Q Angle", key: "qAngle" },
    { label: "Feet", key: "feet" },
  ],

  "Posterior View": [{ label: "Symmetry", key: "symmetry" }],

  Squat: [
    { label: "Air Squat", key: "airSquat" },
    { label: "Overhead Squat", key: "overheadSquat" },
    { label: "Weight Squat", key: "weightSquat" },
  ],

  Lunge: [
    { label: "Front Lunges", key: "frontLunges" },
    { label: "Back Lunges", key: "backLunges" },
    { label: "Walking Lunges", key: "walkingLunges" },
  ],

  Hinge: [
    { label: "Hip Hinge", key: "hipHinge" },
    { label: "Romanian Deadlift", key: "romanianDeadlift" },
    { label: "Single Deadlift", key: "singleDeadlift" },
  ],

  Push: [
    { label: "Push Up", key: "pushUp" },
    { label: "Bench Press", key: "benchPress" },
    { label: "Overhead Press", key: "overheadPress" },
  ],

  Pull: [
    { label: "Pull Up / Chin Up", key: "pullUpOrChinUp" },
    { label: "Seated Row", key: "seatedRow" },
    { label: "Bent Over Row", key: "bentOverRow" },
  ],

  "Core Stability": [
    { label: "Plank", key: "plank" },
    { label: "Side Plank", key: "sidePlank" },
    { label: "Dead Bug", key: "deadBug" },
  ],

  Rotation: [{ label: "Rotation Control", key: "rotationControl" }],

  "Cardiovascular Fitness Test": [
    {
      label: "1 Mile Rockport Fitness Walking",
      key: "1MileRockportFitnessWalking",
    },
  ],

  "Aerobic Engine Test": [
    { label: "12 Minutes Cooper Run", key: "12MinutesCooperRun" },
    { label: "20 Min Maf Air Bike", key: "20MinMafAirBike" },
    { label: "2000 M Row", key: "2000MRow" },
  ],

  "Anaerobic Capacity Test": [
    {
      label: "30 Sec Skierg",
      key: "30SecSkierg",
    },
  ],

  "Muscle Endurance Test": [
    { label: "1 Minutes Push Up", key: "1MinutesPushUp" },
    { label: "Squat Test", key: "squatTest" },
    { label: "Plank Shoulder Taps", key: "plankShoulderTaps" },
  ],
};

export const parseKeyValueText = (
  text: string,
  fields: { label: string; key: string }[],
) => {
  const get = (label: string) => {
    const match = text.match(new RegExp(`${label}: ([^,]+)`));
    return match ? match[1].replace(/[^\d.]/g, "") : "";
  };

  const result: Record<string, string> = {};

  fields.forEach((f) => {
    result[f.key] = get(f.label);
  });

  return result;
};
