import {
  Appointment,
  Claim,
  Clinic,
  Clinician,
  ComplianceEvent,
  Employee,
  Patient,
  UKInvoice,
} from '../types';

export interface NoShowReport {
  totalAppointments: number;
  noShowCount: number;
  noShowRate: number;
  noShowsByClinic: Record<string, number>;
  estimatedAnnualLoss: number;
}

export interface ClaimsDenialReport {
  totalClaims: number;
  deniedCount: number;
  denialRate: number;
  industryBenchmark: number;
  denialRateVsBenchmark: number;
  totalAmountDenied: number;
  denialsByInsuranceType: Record<string, number>;
  denialReasons: Record<string, number>;
}

export interface DocumentationReport {
  totalClinicians: number;
  averageDailyMinutes: number;
  maxDailyMinutes: number;
  minDailyMinutes: number;
  totalMinutesWastedDaily: number;
  cliniciansAboveThreshold: number;
}

export interface CMEComplianceReport {
  totalClinicians: number;
  compliantCount: number;
  nonCompliantCount: number;
  complianceRate: number;
  averageHoursCompleted: number;
  averageHoursRequired: number;
  nonCompliantClinicians: Array<{
    id: string;
    name: string;
    hoursShort: number;
    expiryDate: string;
  }>;
}

export interface HiringReport {
  totalEmployees: number;
  averageDaysToHire: number;
  maxDaysToHire: number;
  minDaysToHire: number;
  industryBenchmark: number;
  daysOverBenchmark: number;
  employeesNotOnboarded: number;
  notOnboardedPercentage: number;
}

export interface ComplianceRiskReport {
  totalEvents: number;
  unresolvedCount: number;
  resolvedCount: number;
  averageRiskScore: number;
  maxRiskScore: number;
  eventsByFramework: Record<string, number>;
  eventsByType: Record<string, number>;
  highRiskUnresolved: number;
}

export interface ExecutiveSummary {
  totalClinics: number;
  usClinics: number;
  ukClinics: number;
  totalPatients: number;
  totalAppointments: number;
  noShowRate: number;
  claimsDenialRate: number;
  claimsDenialVsBenchmark: number;
  averageDocumentationMinutes: number;
  cmeComplianceRate: number;
  averageDaysToHire: number;
  hiringDaysVsBenchmark: number;
  unresolvedComplianceEvents: number;
  highRiskComplianceEvents: number;
}

export interface RevenueSummary {
  usTotalBilled: number;
  usTotalReimbursed: number;
  usCollectionRate: number;
  ukTotalDue: number;
  ukTotalPaid: number;
  ukCollectionRate: number;
  combinedRevenue: number;
  combinedTarget: number;
  revenueVsTarget: number;
}

function toPercentage(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  return (numerator / denominator) * 100;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total: number = values.reduce((sum: number, value: number): number => sum + value, 0);

  return total / values.length;
}

export function generateNoShowReport(
  appointments: Appointment[],
): NoShowReport {
  const totalAppointments: number = appointments.length;
  const noShowAppointments: Appointment[] = appointments.filter(
    (appointment: Appointment): boolean => appointment.status === 'no-show',
  );
  const noShowCount: number = noShowAppointments.length;
  const noShowRate: number = toPercentage(noShowCount, totalAppointments);
  const noShowsByClinic: Record<string, number> = {};

  for (const appointment of noShowAppointments) {
    noShowsByClinic[appointment.clinicId] = (noShowsByClinic[appointment.clinicId] ?? 0) + 1;
  }

  const baselineLossPerRatePoint: number = 1800000 / 22;

  return {
    totalAppointments,
    noShowCount,
    noShowRate,
    noShowsByClinic,
    estimatedAnnualLoss: noShowRate * baselineLossPerRatePoint,
  };
}

export function generateClaimsDenialReport(
  claims: Claim[],
): ClaimsDenialReport {
  const totalClaims: number = claims.length;
  const deniedClaims: Claim[] = claims.filter((claim: Claim): boolean => claim.status === 'denied');
  const deniedCount: number = deniedClaims.length;
  const denialRate: number = toPercentage(deniedCount, totalClaims);
  const industryBenchmark: number = 6.5;
  const denialsByInsuranceType: Record<string, number> = {};
  const denialReasons: Record<string, number> = {};

  for (const claim of deniedClaims) {
    denialsByInsuranceType[claim.insuranceType] = (denialsByInsuranceType[claim.insuranceType] ?? 0) + 1;

    if (claim.denialReason !== null) {
      denialReasons[claim.denialReason] = (denialReasons[claim.denialReason] ?? 0) + 1;
    }
  }

  const totalAmountDenied: number = deniedClaims.reduce(
    (sum: number, claim: Claim): number => sum + claim.amountBilled,
    0,
  );

  return {
    totalClaims,
    deniedCount,
    denialRate,
    industryBenchmark,
    denialRateVsBenchmark: denialRate - industryBenchmark,
    totalAmountDenied,
    denialsByInsuranceType,
    denialReasons,
  };
}

export function generateDocumentationReport(
  clinicians: Clinician[],
): DocumentationReport {
  const totalClinicians: number = clinicians.length;
  const minutes: number[] = clinicians.map(
    (clinician: Clinician): number => clinician.dailyDocumentationMinutes,
  );
  const averageDailyMinutes: number = average(minutes);
  const maxDailyMinutes: number = minutes.length > 0 ? Math.max(...minutes) : 0;
  const minDailyMinutes: number = minutes.length > 0 ? Math.min(...minutes) : 0;
  const totalMinutesWastedDaily: number = minutes.reduce(
    (sum: number, value: number): number => sum + value,
    0,
  );
  const cliniciansAboveThreshold: number = clinicians.filter(
    (clinician: Clinician): boolean => clinician.dailyDocumentationMinutes > 35,
  ).length;

  return {
    totalClinicians,
    averageDailyMinutes,
    maxDailyMinutes,
    minDailyMinutes,
    totalMinutesWastedDaily,
    cliniciansAboveThreshold,
  };
}

export function generateCMEComplianceReport(
  clinicians: Clinician[],
): CMEComplianceReport {
  const totalClinicians: number = clinicians.length;
  const compliantClinicians: Clinician[] = clinicians.filter(
    (clinician: Clinician): boolean => clinician.cmeRecord.isCompliant,
  );
  const compliantCount: number = compliantClinicians.length;
  const nonCompliantCliniciansList: Clinician[] = clinicians.filter(
    (clinician: Clinician): boolean => !clinician.cmeRecord.isCompliant,
  );
  const nonCompliantCount: number = nonCompliantCliniciansList.length;

  return {
    totalClinicians,
    compliantCount,
    nonCompliantCount,
    complianceRate: toPercentage(compliantCount, totalClinicians),
    averageHoursCompleted: average(
      clinicians.map((clinician: Clinician): number => clinician.cmeRecord.hoursCompleted),
    ),
    averageHoursRequired: average(
      clinicians.map((clinician: Clinician): number => clinician.cmeRecord.hoursRequired),
    ),
    nonCompliantClinicians: nonCompliantCliniciansList.map((clinician: Clinician) => ({
      id: clinician.id,
      name: `${clinician.firstName} ${clinician.lastName}`,
      hoursShort: Math.max(0, clinician.cmeRecord.hoursRequired - clinician.cmeRecord.hoursCompleted),
      expiryDate: clinician.cmeRecord.expiryDate,
    })),
  };
}

export function generateHiringReport(
  employees: Employee[],
): HiringReport {
  const totalEmployees: number = employees.length;
  const daysToHireValues: number[] = employees.map(
    (employee: Employee): number => employee.daysToHire,
  );
  const averageDaysToHire: number = average(daysToHireValues);
  const maxDaysToHire: number = daysToHireValues.length > 0 ? Math.max(...daysToHireValues) : 0;
  const minDaysToHire: number = daysToHireValues.length > 0 ? Math.min(...daysToHireValues) : 0;
  const industryBenchmark: number = 27;
  const employeesNotOnboarded: number = employees.filter(
    (employee: Employee): boolean => !employee.isOnboarded,
  ).length;

  return {
    totalEmployees,
    averageDaysToHire,
    maxDaysToHire,
    minDaysToHire,
    industryBenchmark,
    daysOverBenchmark: averageDaysToHire - industryBenchmark,
    employeesNotOnboarded,
    notOnboardedPercentage: toPercentage(employeesNotOnboarded, totalEmployees),
  };
}

export function generateComplianceRiskReport(
  events: ComplianceEvent[],
): ComplianceRiskReport {
  const totalEvents: number = events.length;
  const unresolvedCount: number = events.filter((event: ComplianceEvent): boolean => !event.isResolved).length;
  const resolvedCount: number = totalEvents - unresolvedCount;
  const riskScores: number[] = events.map((event: ComplianceEvent): number => event.riskScore);
  const averageRiskScore: number = average(riskScores);
  const maxRiskScore: number = riskScores.length > 0 ? Math.max(...riskScores) : 0;
  const eventsByFramework: Record<string, number> = {};
  const eventsByType: Record<string, number> = {};

  for (const event of events) {
    eventsByFramework[event.framework] = (eventsByFramework[event.framework] ?? 0) + 1;
    eventsByType[event.eventType] = (eventsByType[event.eventType] ?? 0) + 1;
  }

  const highRiskUnresolved: number = events.filter(
    (event: ComplianceEvent): boolean => event.riskScore > 70 && !event.isResolved,
  ).length;

  return {
    totalEvents,
    unresolvedCount,
    resolvedCount,
    averageRiskScore,
    maxRiskScore,
    eventsByFramework,
    eventsByType,
    highRiskUnresolved,
  };
}

export function generateExecutiveSummary(
  clinics: Clinic[],
  patients: Patient[],
  appointments: Appointment[],
  claims: Claim[],
  clinicians: Clinician[],
  employees: Employee[],
  complianceEvents: ComplianceEvent[],
): ExecutiveSummary {
  const noShowReport: NoShowReport = generateNoShowReport(appointments);
  const claimsDenialReport: ClaimsDenialReport = generateClaimsDenialReport(claims);
  const documentationReport: DocumentationReport = generateDocumentationReport(clinicians);
  const cmeReport: CMEComplianceReport = generateCMEComplianceReport(clinicians);
  const hiringReport: HiringReport = generateHiringReport(employees);
  const complianceReport: ComplianceRiskReport = generateComplianceRiskReport(complianceEvents);

  return {
    totalClinics: clinics.length,
    usClinics: clinics.filter((clinic: Clinic): boolean => clinic.country === 'US').length,
    ukClinics: clinics.filter((clinic: Clinic): boolean => clinic.country === 'UK').length,
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    noShowRate: noShowReport.noShowRate,
    claimsDenialRate: claimsDenialReport.denialRate,
    claimsDenialVsBenchmark: claimsDenialReport.denialRateVsBenchmark,
    averageDocumentationMinutes: documentationReport.averageDailyMinutes,
    cmeComplianceRate: cmeReport.complianceRate,
    averageDaysToHire: hiringReport.averageDaysToHire,
    hiringDaysVsBenchmark: hiringReport.daysOverBenchmark,
    unresolvedComplianceEvents: complianceReport.unresolvedCount,
    highRiskComplianceEvents: complianceReport.highRiskUnresolved,
  };
}

export function generateRevenueSummary(
  claims: Claim[],
  invoices: UKInvoice[],
): RevenueSummary {
  const usTotalBilled: number = claims.reduce(
    (sum: number, claim: Claim): number => sum + claim.amountBilled,
    0,
  );
  const usTotalReimbursed: number = claims.reduce(
    (sum: number, claim: Claim): number => sum + claim.amountReimbursed,
    0,
  );
  const ukTotalDue: number = invoices.reduce(
    (sum: number, invoice: UKInvoice): number => sum + invoice.amountDue,
    0,
  );
  const ukTotalPaid: number = invoices.reduce(
    (sum: number, invoice: UKInvoice): number => sum + invoice.amountPaid,
    0,
  );
  const combinedRevenue: number = usTotalReimbursed + ukTotalPaid;
  const combinedTarget: number = 28000000;

  return {
    usTotalBilled,
    usTotalReimbursed,
    usCollectionRate: toPercentage(usTotalReimbursed, usTotalBilled),
    ukTotalDue,
    ukTotalPaid,
    ukCollectionRate: toPercentage(ukTotalPaid, ukTotalDue),
    combinedRevenue,
    combinedTarget,
    revenueVsTarget: combinedRevenue - combinedTarget,
  };
}
