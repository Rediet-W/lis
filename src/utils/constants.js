export const USER_ROLES = {
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  LABORATORIST: "laboratorist",
  PATIENT: "patient",
};

export const VISIT_STATUS = {
  REGISTERED: "registered",
  SAMPLE_COLLECTED: "sample_collected",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const TEST_ORDER_STATUS = {
  ORDERED: "ordered",
  SAMPLE_COLLECTED: "sample_collected",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PRIORITY = {
  ROUTINE: "routine",
  URGENT: "urgent",
  EMERGENCY: "emergency",
};

export const SAMPLE_TYPES = {
  SERUM: "serum",
  PLASMA: "plasma",
  WHOLE_BLOOD: "whole_blood",
  URINE: "urine",
  OTHER: "other",
};

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  BOTH: "both",
};

export const BLOOD_TYPES = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
  UNKNOWN: "unknown",
};

export const TEST_RESULT_STATUS = {
  NORMAL: "normal",
  LOW: "low",
  HIGH: "high",
  CRITICAL: "critical",
};

export const FIELD_TYPES = {
  CHECKBOX: "checkbox",
  RADIO: "radio",
  DROPDOWN: "dropdown",
  TEXT: "text",
};

export const TUBE_TYPES = {
  EDTA: "EDTA",
  HEPARIN: "Heparin",
  SODIUM_CITRATE: "Sodium Citrate",
  SERUM_SEPARATOR: "Serum Separator",
  OTHER: "Other",
};

export const TESTING_MODES = {
  STANDARD: "standard",
  QUICK: "quick",
  BOTH: "both",
};
