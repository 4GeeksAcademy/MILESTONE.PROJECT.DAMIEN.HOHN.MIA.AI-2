export interface Clinic {
  id: string;
  name: string;
  country: 'US' | 'UK';
  state: 'TX' | 'FL' | 'GA' | 'London' | 'Manchester' | null;
  city: string;
  isActive: boolean;
  ehrSystem: 'US_EHR' | 'UK_EHR';
  totalStaff: number;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: 'US' | 'UK';
  clinicId: string;
  language: string;
  registeredAt: string;
  hasSharedHistory: boolean;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'no-show'
  | 'cancelled'
  | 'rescheduled';

export type AppointmentType =
  | 'primary-care'
  | 'specialist'
  | 'chronic-disease'
  | 'preventive';

export interface Appointment {
  id: string;
  patientId: string;
  clinicId: string;
  clinicianId: string;
  scheduledAt: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  bookingMethod: 'phone' | 'front-desk' | 'online';
  reminderSent: boolean;
  noShowRisk: 'low' | 'medium' | 'high';
  durationMinutes: number;
}

export type ClinicianRole =
  | 'physician'
  | 'nurse-practitioner'
  | 'nurse'
  | 'medical-assistant';

export interface CMERecord {
  year: number;
  hoursCompleted: number;
  hoursRequired: number;
  isCompliant: boolean;
  expiryDate: string;
}

export interface Clinician {
  id: string;
  firstName: string;
  lastName: string;
  role: ClinicianRole;
  clinicId: string;
  country: 'US' | 'UK';
  licenceNumber: string;
  isActive: boolean;
  dailyDocumentationMinutes: number;
  cmeRecord: CMERecord;
  hireDatee: string;
}

export type ClaimStatus =
  | 'submitted'
  | 'approved'
  | 'denied'
  | 'pending'
  | 'resubmitted';

export type InsuranceType =
  | 'commercial'
  | 'medicare'
  | 'medicaid';

export interface Claim {
  id: string;
  appointmentId: string;
  patientId: string;
  clinicId: string;
  insuranceType: InsuranceType;
  billingCode: string;
  amountBilled: number;
  amountReimbursed: number;
  status: ClaimStatus;
  denialReason: string | null;
  submittedAt: string;
  resolvedAt: string | null;
  isManualSubmission: boolean;
}

export type UKBillingType = 'private-pay' | 'nhs-contract';

export type InvoiceStatus =
  | 'issued'
  | 'paid'
  | 'overdue'
  | 'disputed';

export interface UKInvoice {
  id: string;
  appointmentId: string;
  patientId: string;
  clinicId: string;
  billingType: UKBillingType;
  amountDue: number;
  amountPaid: number;
  status: InvoiceStatus;
  issuedAt: string;
  paidAt: string | null;
  isGDPRCompliant: boolean;
}

export type Department =
  | 'clinical-operations'
  | 'patient-experience'
  | 'revenue-cycle'
  | 'compliance'
  | 'people-workforce'
  | 'technology'
  | 'executive';

export type EmploymentStatus =
  | 'active'
  | 'on-leave'
  | 'terminated';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  department: Department;
  clinicId: string | null;
  country: 'US' | 'UK';
  status: EmploymentStatus;
  hireDate: string;
  daysToHire: number;
  isOnboarded: boolean;
  complianceTrainingComplete: boolean;
}

export type ComplianceFramework = 'HIPAA' | 'UK_GDPR';

export type ComplianceEventType =
  | 'data-access'
  | 'data-request'
  | 'audit-log'
  | 'breach-flag'
  | 'training-completion';

export interface ComplianceEvent {
  id: string;
  clinicId: string;
  framework: ComplianceFramework;
  eventType: ComplianceEventType;
  occurredAt: string;
  resolvedAt: string | null;
  riskScore: number;
  isResolved: boolean;
  description: string;
}
