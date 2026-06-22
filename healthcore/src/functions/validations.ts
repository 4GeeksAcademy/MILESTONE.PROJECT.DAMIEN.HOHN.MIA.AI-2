import {
  Appointment,
  Claim,
  Clinic,
  Clinician,
  Department,
  Employee,
  Patient,
  UKInvoice,
} from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}

function parseDate(value: string): number {
  return new Date(value).getTime();
}

function isValidDateString(value: string): boolean {
  return !Number.isNaN(parseDate(value));
}

function isPastDate(value: string): boolean {
  const time: number = parseDate(value);

  return !Number.isNaN(time) && time < Date.now();
}

function isFutureDate(value: string): boolean {
  const time: number = parseDate(value);

  return !Number.isNaN(time) && time > Date.now();
}

function calculateAgeYears(dateOfBirth: string): number {
  const dob: Date = new Date(dateOfBirth);
  const today: Date = new Date();

  let age: number = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff: number = today.getUTCMonth() - dob.getUTCMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())
  ) {
    age -= 1;
  }

  return age;
}

export function validateAppointment(
  appointment: Appointment,
  patients: Patient[],
  clinics: Clinic[],
): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(appointment.patientId)) {
    errors.push('patientId must be a non-empty string');
  }

  if (!isNonEmptyString(appointment.clinicId)) {
    errors.push('clinicId must be a non-empty string');
  }

  if (!isNonEmptyString(appointment.clinicianId)) {
    errors.push('clinicianId must be a non-empty string');
  }

  if (!isValidDateString(appointment.scheduledAt)) {
    errors.push('scheduledAt must be a valid ISO 8601 date string');
  }

  if (appointment.durationMinutes < 15 || appointment.durationMinutes > 120) {
    errors.push('durationMinutes must be between 15 and 120');
  }

  const bookingMethods: Array<'phone' | 'front-desk' | 'online'> = [
    'phone',
    'front-desk',
    'online',
  ];

  if (!bookingMethods.includes(appointment.bookingMethod)) {
    errors.push('bookingMethod must match HealthCore booking methods');
  }

  const patient: Patient | undefined = patients.find(
    (item: Patient): boolean => item.id === appointment.patientId,
  );
  const clinic: Clinic | undefined = clinics.find(
    (item: Clinic): boolean => item.id === appointment.clinicId,
  );

  if (patient === undefined) {
    errors.push('patientId must reference an existing patient');
  }

  if (clinic === undefined) {
    errors.push('clinicId must reference an existing clinic');
  }

  if (patient !== undefined && clinic !== undefined && patient.country !== clinic.country) {
    errors.push(`${clinic.country} clinics can only have ${clinic.country} patients`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateClaim(
  claim: Claim,
  clinics: Clinic[],
): ValidationResult {
  const errors: string[] = [];

  if (claim.amountBilled <= 0) {
    errors.push('amountBilled must be greater than 0');
  }

  if (!isNonEmptyString(claim.billingCode)) {
    errors.push('billingCode must be a non-empty string');
  }

  const validInsuranceTypes: Array<'commercial' | 'medicare' | 'medicaid'> = [
    'commercial',
    'medicare',
    'medicaid',
  ];

  if (!validInsuranceTypes.includes(claim.insuranceType)) {
    errors.push('insuranceType must be valid');
  }

  if (claim.status === 'denied' && claim.denialReason === null) {
    errors.push('if status is denied, denialReason must not be null');
  }

  if (claim.amountReimbursed > claim.amountBilled) {
    errors.push('amountReimbursed cannot exceed amountBilled');
  }

  if (!isValidDateString(claim.submittedAt)) {
    errors.push('submittedAt must be a valid date');
  }

  const clinic: Clinic | undefined = clinics.find(
    (item: Clinic): boolean => item.id === claim.clinicId,
  );

  if (clinic === undefined) {
    errors.push('clinicId must reference an existing clinic');
  } else if (clinic.ehrSystem !== 'US_EHR') {
    errors.push('claims can only be submitted for US clinics (ehrSystem US_EHR)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUKInvoice(
  invoice: UKInvoice,
  clinics: Clinic[],
): ValidationResult {
  const errors: string[] = [];

  if (invoice.amountDue <= 0) {
    errors.push('amountDue must be greater than 0');
  }

  if (invoice.amountPaid > invoice.amountDue) {
    errors.push('amountPaid cannot exceed amountDue');
  }

  const clinic: Clinic | undefined = clinics.find(
    (item: Clinic): boolean => item.id === invoice.clinicId,
  );

  if (clinic === undefined) {
    errors.push('clinicId must reference an existing clinic');
  } else if (clinic.ehrSystem !== 'UK_EHR') {
    errors.push('invoices can only exist for UK clinics (ehrSystem UK_EHR)');
  }

  if (!invoice.isGDPRCompliant) {
    errors.push('isGDPRCompliant must be true before invoice is issued');
  }

  if (invoice.status === 'paid' && invoice.paidAt === null) {
    errors.push('if status is paid, paidAt must not be null');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateClinicianCME(
  clinician: Clinician,
): ValidationResult {
  const errors: string[] = [];

  if (clinician.cmeRecord.hoursCompleted < 0) {
    errors.push('hoursCompleted cannot be negative');
  }

  if (clinician.cmeRecord.hoursRequired <= 0) {
    errors.push('hoursRequired must be greater than 0');
  }

  if (
    clinician.cmeRecord.isCompliant &&
    clinician.cmeRecord.hoursCompleted < clinician.cmeRecord.hoursRequired
  ) {
    errors.push('if isCompliant is true, hoursCompleted >= hoursRequired');
  }

  if (!isFutureDate(clinician.cmeRecord.expiryDate)) {
    errors.push('expiryDate must be a valid future date');
  }

  if (!isNonEmptyString(clinician.licenceNumber)) {
    errors.push('licenceNumber must be a non-empty string');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePatient(
  patient: Patient,
): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(patient.firstName) || !isNonEmptyString(patient.lastName)) {
    errors.push('firstName and lastName must be non-empty strings');
  }

  if (!isPastDate(patient.dateOfBirth)) {
    errors.push('dateOfBirth must be a valid past date');
  } else if (calculateAgeYears(patient.dateOfBirth) < 18) {
    errors.push('patient must be 18 or older');
  }

  if (!isNonEmptyString(patient.clinicId)) {
    errors.push('clinicId must be a non-empty string');
  }

  if (!(patient.country === 'US' || patient.country === 'UK')) {
    errors.push('country must be US or UK');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateEmployeeOnboarding(
  employee: Employee,
): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(employee.firstName) || !isNonEmptyString(employee.lastName)) {
    errors.push('firstName and lastName must be non-empty strings');
  }

  if (!isPastDate(employee.hireDate)) {
    errors.push('hireDate must be a valid past date');
  }

  if (employee.daysToHire <= 0) {
    errors.push('daysToHire must be greater than 0');
  }

  if (employee.isOnboarded && !employee.complianceTrainingComplete) {
    errors.push('complianceTrainingComplete must be true before isOnboarded can be true');
  }

  const validDepartments: Department[] = [
    'clinical-operations',
    'patient-experience',
    'revenue-cycle',
    'compliance',
    'people-workforce',
    'technology',
    'executive',
  ];

  if (!validDepartments.includes(employee.department)) {
    errors.push('department must be a valid HealthCore department');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
