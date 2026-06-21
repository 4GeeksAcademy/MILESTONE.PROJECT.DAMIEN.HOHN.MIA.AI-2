import {
  Appointment,
  Claim,
  Clinician,
  ComplianceEvent,
  Employee,
  Patient,
  UKInvoice,
} from '../types';

function sortByDirection(
  left: number,
  right: number,
  direction: 'asc' | 'desc',
): number {
  return direction === 'asc' ? left - right : right - left;
}

export function sortAppointmentsByDate(
  appointments: Appointment[],
  direction: 'asc' | 'desc',
): Appointment[] {
  return [...appointments].sort((a: Appointment, b: Appointment): number => {
    const left: number = new Date(a.scheduledAt).getTime();
    const right: number = new Date(b.scheduledAt).getTime();

    return sortByDirection(left, right, direction);
  });
}

export function sortClaimsByAmountBilled(
  claims: Claim[],
  direction: 'asc' | 'desc',
): Claim[] {
  return [...claims].sort((a: Claim, b: Claim): number =>
    sortByDirection(a.amountBilled, b.amountBilled, direction),
  );
}

export function sortCliniciansByDocumentationTime(
  clinicians: Clinician[],
  direction: 'asc' | 'desc',
): Clinician[] {
  return [...clinicians].sort((a: Clinician, b: Clinician): number =>
    sortByDirection(
      a.dailyDocumentationMinutes,
      b.dailyDocumentationMinutes,
      direction,
    ),
  );
}

export function sortEmployeesByDaysToHire(
  employees: Employee[],
  direction: 'asc' | 'desc',
): Employee[] {
  return [...employees].sort((a: Employee, b: Employee): number =>
    sortByDirection(a.daysToHire, b.daysToHire, direction),
  );
}

export function sortComplianceEventsByRiskScore(
  events: ComplianceEvent[],
  direction: 'asc' | 'desc',
): ComplianceEvent[] {
  return [...events].sort((a: ComplianceEvent, b: ComplianceEvent): number =>
    sortByDirection(a.riskScore, b.riskScore, direction),
  );
}

export function sortPatientsByRegistrationDate(
  patients: Patient[],
  direction: 'asc' | 'desc',
): Patient[] {
  return [...patients].sort((a: Patient, b: Patient): number => {
    const left: number = new Date(a.registeredAt).getTime();
    const right: number = new Date(b.registeredAt).getTime();

    return sortByDirection(left, right, direction);
  });
}

export function sortUKInvoicesByAmountDue(
  invoices: UKInvoice[],
  direction: 'asc' | 'desc',
): UKInvoice[] {
  return [...invoices].sort((a: UKInvoice, b: UKInvoice): number =>
    sortByDirection(a.amountDue, b.amountDue, direction),
  );
}

export function sortAppointmentsByClinicThenDate(
  appointments: Appointment[],
): Appointment[] {
  return [...appointments].sort((a: Appointment, b: Appointment): number => {
    const clinicCompare: number = a.clinicId.localeCompare(b.clinicId);

    if (clinicCompare !== 0) {
      return clinicCompare;
    }

    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });
}
