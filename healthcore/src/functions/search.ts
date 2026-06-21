import {
  Appointment,
  Claim,
  Clinician,
  ComplianceEvent,
  Employee,
  Patient,
} from '../types';

export function linearSearchPatientById(
  patients: Patient[],
  id: string,
): Patient | null {
  for (const patient of patients) {
    if (patient.id === id) {
      return patient;
    }
  }

  return null;
}

export function linearSearchAppointmentByPatient(
  appointments: Appointment[],
  patientId: string,
): Appointment | null {
  for (const appointment of appointments) {
    if (appointment.patientId === patientId) {
      return appointment;
    }
  }

  return null;
}

export function linearSearchClaimById(
  claims: Claim[],
  id: string,
): Claim | null {
  for (const claim of claims) {
    if (claim.id === id) {
      return claim;
    }
  }

  return null;
}

export function linearSearchClinicianByLicence(
  clinicians: Clinician[],
  licenceNumber: string,
): Clinician | null {
  for (const clinician of clinicians) {
    if (clinician.licenceNumber === licenceNumber) {
      return clinician;
    }
  }

  return null;
}

export function linearSearchEmployeeById(
  employees: Employee[],
  id: string,
): Employee | null {
  for (const employee of employees) {
    if (employee.id === id) {
      return employee;
    }
  }

  return null;
}

// Input must already be sorted by amountBilled in ascending order.
export function binarySearchSortedClaimsByAmount(
  sortedClaims: Claim[],
  targetAmount: number,
): number {
  let left: number = 0;
  let right: number = sortedClaims.length - 1;

  while (left <= right) {
    const middle: number = Math.floor((left + right) / 2);
    const value: number = sortedClaims[middle].amountBilled;

    if (value === targetAmount) {
      return middle;
    }

    if (value < targetAmount) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

// Input must already be sorted by scheduledAt in ascending order.
export function binarySearchSortedAppointmentsByDate(
  sortedAppointments: Appointment[],
  targetDate: string,
): number {
  const targetTime: number = new Date(targetDate).getTime();

  if (Number.isNaN(targetTime)) {
    return -1;
  }

  let left: number = 0;
  let right: number = sortedAppointments.length - 1;

  while (left <= right) {
    const middle: number = Math.floor((left + right) / 2);
    const value: number = new Date(sortedAppointments[middle].scheduledAt).getTime();

    if (value === targetTime) {
      return middle;
    }

    if (value < targetTime) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

// Input must already be sorted by riskScore in ascending order.
export function binarySearchSortedComplianceByRisk(
  sortedEvents: ComplianceEvent[],
  targetRisk: number,
): number {
  let left: number = 0;
  let right: number = sortedEvents.length - 1;

  while (left <= right) {
    const middle: number = Math.floor((left + right) / 2);
    const value: number = sortedEvents[middle].riskScore;

    if (value === targetRisk) {
      return middle;
    }

    if (value < targetRisk) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}
