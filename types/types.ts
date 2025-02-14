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
