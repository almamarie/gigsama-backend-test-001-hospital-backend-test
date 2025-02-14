export type Gender = 'MALE' | 'FEMALE';

export type PatientDoctorType = {
  id: number;
  patientId: number;
  doctorId: number;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
  checkList: string | null;
  planId: string | null;
  plan: PlanBaseType | null;
};

export type PlanBaseType = {
  planId: string;
  createdAt: Date;
  updatedAt: Date;
  patientDoctorId: string;
};

export type PlanType = PlanBaseType & {
  patientDoctor: PatientDoctorType | null;
};

export enum ReminderFrequency {
  ONCE_DAILY = 'ONCE_DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  THREE_TIMES_DAILY = 'THREE_TIMES_DAILY',
  FOUR_TIMES_DAILY = 'FOUR_TIMES_DAILY'
}

export type PlanItem = {
  task: string;
  frequency: ReminderFrequency;
  duration: number;
  reminderMessage: string;
};

export type ActionableSteps = {
  checklist: string[];
  plan: PlanItem[];
};

export interface ILanguageModel {
  processNotes(notes: string): Promise<ActionableSteps>;
}

export type FormattedNoteResponse = {
  id: string;
  patientId: string;
  doctorId: string;
  encryptedNote: string;
  checklist: string[];
  plan: PlanItem[];
  patientDoctorId: string;
  createdAt: string;
  updatedAt: string;
};