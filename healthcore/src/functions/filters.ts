import {
  Appointment,
  AppointmentStatus,
  Claim,
  ClaimStatus,
  Clinician,
  ClinicianRole,
  Clinic,
  ComplianceEvent,
  ComplianceFramework,
  Department,
  Employee,
  InsuranceType,
} from '../types';

export function filterClinicsByCountry(
  clinics: Clinic[],
  country: 'US' | 'UK',
): Clinic[] {
  return clinics.filter((clinic: Clinic): boolean => clinic.country === country);
}

export function filterActiveClinicsByEHR(
  clinics: Clinic[],
  ehrSystem: 'US_EHR' | 'UK_EHR',
): Clinic[] {
  return clinics.filter(
    (clinic: Clinic): boolean => clinic.isActive && clinic.ehrSystem === ehrSystem,
  );
}

export function filterAppointmentsByStatus(
  appointments: Appointment[],
  status: AppointmentStatus,
): Appointment[] {
  return appointments.filter(
    (appointment: Appointment): boolean => appointment.status === status,
  );
}

export function filterAppointmentsByClinic(
  appointments: Appointment[],
  clinicId: string,
): Appointment[] {
  return appointments.filter(
    (appointment: Appointment): boolean => appointment.clinicId === clinicId,
  );
}

export function filterAppointmentsByNoShowRisk(
  appointments: Appointment[],
  risk: 'low' | 'medium' | 'high',
): Appointment[] {
  return appointments.filter(
    (appointment: Appointment): boolean => appointment.noShowRisk === risk,
  );
}

export function filterAppointmentsByDateRange(
  appointments: Appointment[],
  startDate: string,
  endDate: string,
): Appointment[] {
  const start: number = new Date(startDate).getTime();
  const end: number = new Date(endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return [];
  }

  return appointments.filter((appointment: Appointment): boolean => {
    const appointmentDate: number = new Date(appointment.scheduledAt).getTime();

    if (Number.isNaN(appointmentDate)) {
      return false;
    }

    return appointmentDate >= start && appointmentDate <= end;
  });
}

export function filterUnremindedHighRiskAppointments(
  appointments: Appointment[],
): Appointment[] {
  return appointments.filter(
    (appointment: Appointment): boolean =>
      appointment.noShowRisk === 'high' && !appointment.reminderSent,
  );
}

export function filterClaimsByStatus(
  claims: Claim[],
  status: ClaimStatus,
): Claim[] {
  return claims.filter((claim: Claim): boolean => claim.status === status);
}

export function filterDeniedClaims(
  claims: Claim[],
): Claim[] {
  return claims.filter((claim: Claim): boolean => claim.status === 'denied');
}

export function filterClaimsByInsuranceType(
  claims: Claim[],
  insuranceType: InsuranceType,
): Claim[] {
  return claims.filter(
    (claim: Claim): boolean => claim.insuranceType === insuranceType,
  );
}

export function filterManualSubmissions(
  claims: Claim[],
): Claim[] {
  return claims.filter((claim: Claim): boolean => claim.isManualSubmission);
}

export function filterCliniciansWithNonCompliantCME(
  clinicians: Clinician[],
): Clinician[] {
  return clinicians.filter(
    (clinician: Clinician): boolean => !clinician.cmeRecord.isCompliant,
  );
}

export function filterCliniciansByRole(
  clinicians: Clinician[],
  role: ClinicianRole,
): Clinician[] {
  return clinicians.filter(
    (clinician: Clinician): boolean => clinician.role === role,
  );
}

export function filterCliniciansByClinic(
  clinicians: Clinician[],
  clinicId: string,
): Clinician[] {
  return clinicians.filter(
    (clinician: Clinician): boolean => clinician.clinicId === clinicId,
  );
}

export function filterEmployeesByDepartment(
  employees: Employee[],
  department: Department,
): Employee[] {
  return employees.filter(
    (employee: Employee): boolean => employee.department === department,
  );
}

export function filterEmployeesByCountry(
  employees: Employee[],
  country: 'US' | 'UK',
): Employee[] {
  return employees.filter((employee: Employee): boolean => employee.country === country);
}

export function filterEmployeesNotOnboarded(
  employees: Employee[],
): Employee[] {
  return employees.filter((employee: Employee): boolean => !employee.isOnboarded);
}

export function filterComplianceEventsByFramework(
  events: ComplianceEvent[],
  framework: ComplianceFramework,
): ComplianceEvent[] {
  return events.filter((event: ComplianceEvent): boolean => event.framework === framework);
}

export function filterUnresolvedComplianceEvents(
  events: ComplianceEvent[],
): ComplianceEvent[] {
  return events.filter((event: ComplianceEvent): boolean => !event.isResolved);
}

export function filterHighRiskComplianceEvents(
  events: ComplianceEvent[],
  threshold: number,
): ComplianceEvent[] {
  return events.filter((event: ComplianceEvent): boolean => event.riskScore > threshold);
}
