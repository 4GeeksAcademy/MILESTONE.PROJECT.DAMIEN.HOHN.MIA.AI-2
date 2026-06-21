import {
  claims,
  appointments,
  clinicians,
  clinics,
  complianceEvents,
  employees,
  patients,
  ukInvoices,
} from './data/seed';
import {
  generateCMEComplianceReport,
  generateClaimsDenialReport,
  generateComplianceRiskReport,
  generateDocumentationReport,
  generateExecutiveSummary,
  generateHiringReport,
  generateNoShowReport,
  generateRevenueSummary,
} from './functions/aggregations';
import {
  filterActiveClinicsByEHR,
  filterAppointmentsByClinic,
  filterAppointmentsByDateRange,
  filterAppointmentsByNoShowRisk,
  filterAppointmentsByStatus,
  filterClaimsByInsuranceType,
  filterClaimsByStatus,
  filterCliniciansByClinic,
  filterCliniciansByRole,
  filterCliniciansWithNonCompliantCME,
  filterClinicsByCountry,
  filterComplianceEventsByFramework,
  filterDeniedClaims,
  filterEmployeesByCountry,
  filterEmployeesByDepartment,
  filterEmployeesNotOnboarded,
  filterHighRiskComplianceEvents,
  filterManualSubmissions,
  filterUnremindedHighRiskAppointments,
  filterUnresolvedComplianceEvents,
} from './functions/filters';
import {
  binarySearchSortedAppointmentsByDate,
  binarySearchSortedClaimsByAmount,
  binarySearchSortedComplianceByRisk,
  linearSearchAppointmentByPatient,
  linearSearchClaimById,
  linearSearchClinicianByLicence,
  linearSearchEmployeeById,
  linearSearchPatientById,
} from './functions/search';
import {
  sortAppointmentsByClinicThenDate,
  sortAppointmentsByDate,
  sortClaimsByAmountBilled,
  sortCliniciansByDocumentationTime,
  sortComplianceEventsByRiskScore,
  sortEmployeesByDaysToHire,
  sortPatientsByRegistrationDate,
  sortUKInvoicesByAmountDue,
} from './functions/sorting';
import {
  validateAppointment,
  validateClaim,
  validateClinicianCME,
  validateEmployeeOnboarding,
  validatePatient,
  validateUKInvoice,
} from './functions/validations';
import {
  Appointment,
  Claim,
  Clinician,
  Employee,
  Patient,
  UKInvoice,
} from './types';

declare const console: {
  log: (...data: unknown[]) => void;
};

function printSection(title: string): void {
  console.log('\n=======================================');
  console.log(title);
  console.log('=======================================');
}

function printResult(label: string, value: unknown): void {
  console.log(`\n${label}`);
  console.log(JSON.stringify(value, null, 2));
}

console.log('═══════════════════════════════════════');
console.log('   HEALTHCORE DIGITAL — SYSTEM REPORT  ');
console.log('═══════════════════════════════════════');

printSection('1. EXECUTIVE SUMMARY — Dr. Sandra Okonkwo');
const executiveSummary = generateExecutiveSummary(
  clinics,
  patients,
  appointments,
  claims,
  clinicians,
  employees,
  complianceEvents,
);
printResult('Executive summary', executiveSummary);

printSection('2. CLINICAL OPERATIONS — Dr. Marcus Reid');
const documentationReport = generateDocumentationReport(clinicians);
printResult('Documentation report', documentationReport);

const nonCompliantCMEClinicians = filterCliniciansWithNonCompliantCME(clinicians);
printResult('Non-compliant CME clinicians', nonCompliantCMEClinicians);

const cliniciansByDocumentationDesc = sortCliniciansByDocumentationTime(clinicians, 'desc');
printResult('Clinicians sorted by documentation time (desc)', cliniciansByDocumentationDesc);

const foundClinicianByLicence = linearSearchClinicianByLicence(clinicians, 'US-TX-MR-001');
const missingClinicianByLicence = linearSearchClinicianByLicence(clinicians, 'NOT-FOUND');
printResult('Linear search clinician by licence (existing)', foundClinicianByLicence);
printResult('Linear search clinician by licence (missing)', missingClinicianByLicence);

printResult('Clinicians by role physician', filterCliniciansByRole(clinicians, 'physician'));
printResult('Clinicians by clinic clinic-us-tx-1', filterCliniciansByClinic(clinicians, 'clinic-us-tx-1'));

printSection('3. PATIENT EXPERIENCE — Priya Nair');
const noShowReport = generateNoShowReport(appointments);
printResult('No-show report', noShowReport);

const highRiskAppointments = filterAppointmentsByNoShowRisk(appointments, 'high');
printResult('High-risk appointments', highRiskAppointments);

const unremindedHighRiskAppointments = filterUnremindedHighRiskAppointments(appointments);
printResult('Unreminded high-risk appointments', unremindedHighRiskAppointments);

const appointmentsSortedDesc = sortAppointmentsByDate(appointments, 'desc');
printResult('Appointments sorted by date (desc)', appointmentsSortedDesc);

printResult('Appointments by status no-show', filterAppointmentsByStatus(appointments, 'no-show'));
printResult('Appointments by clinic clinic-us-tx-1', filterAppointmentsByClinic(appointments, 'clinic-us-tx-1'));
printResult(
  'Appointments by date range (May 1-5)',
  filterAppointmentsByDateRange(
    appointments,
    '2026-05-01T00:00:00Z',
    '2026-05-05T23:59:59Z',
  ),
);
printResult('Appointments sorted by clinic then date', sortAppointmentsByClinicThenDate(appointments));

printSection('4. REVENUE CYCLE — Tom Callahan');
const revenueSummary = generateRevenueSummary(claims, ukInvoices);
printResult('Revenue summary', revenueSummary);

const claimsDenialReport = generateClaimsDenialReport(claims);
printResult('Claims denial report', claimsDenialReport);

const deniedClaims = filterDeniedClaims(claims);
printResult('Denied claims', deniedClaims);

const manualClaims = filterManualSubmissions(claims);
printResult('Manual submissions', manualClaims);

const claimsSortedDesc = sortClaimsByAmountBilled(claims, 'desc');
const claimsSortedAsc = sortClaimsByAmountBilled(claims, 'asc');
printResult('Claims sorted by billed amount (desc)', claimsSortedDesc);

const claimsBinaryHit = binarySearchSortedClaimsByAmount(claimsSortedAsc, claimsSortedAsc[0]?.amountBilled ?? -1);
const claimsBinaryMiss = binarySearchSortedClaimsByAmount(claimsSortedAsc, 999999);
printResult('Binary search claims by billed amount (existing index)', claimsBinaryHit);
printResult('Binary search claims by billed amount (missing index)', claimsBinaryMiss);

printResult('Claims by status approved', filterClaimsByStatus(claims, 'approved'));
printResult('Claims by insurance type commercial', filterClaimsByInsuranceType(claims, 'commercial'));

printSection('5. COMPLIANCE — Claire Whitfield');
const complianceRiskReport = generateComplianceRiskReport(complianceEvents);
printResult('Compliance risk report', complianceRiskReport);

const unresolvedComplianceEvents = filterUnresolvedComplianceEvents(complianceEvents);
printResult('Unresolved compliance events', unresolvedComplianceEvents);

const highRiskComplianceEvents = filterHighRiskComplianceEvents(complianceEvents, 70);
printResult('High-risk compliance events (>70)', highRiskComplianceEvents);

const hipaaEvents = filterComplianceEventsByFramework(complianceEvents, 'HIPAA');
const ukGdprEvents = filterComplianceEventsByFramework(complianceEvents, 'UK_GDPR');
printResult('HIPAA events', hipaaEvents);
printResult('UK_GDPR events', ukGdprEvents);

const sortedComplianceAsc = sortComplianceEventsByRiskScore(complianceEvents, 'asc');
printResult('Compliance events sorted by risk score (asc)', sortedComplianceAsc);

const complianceBinaryHit = binarySearchSortedComplianceByRisk(sortedComplianceAsc, sortedComplianceAsc[0]?.riskScore ?? -1);
const complianceBinaryMiss = binarySearchSortedComplianceByRisk(sortedComplianceAsc, 101);
printResult('Binary search compliance by risk (existing index)', complianceBinaryHit);
printResult('Binary search compliance by risk (missing index)', complianceBinaryMiss);

printSection('6. PEOPLE AND WORKFORCE — Diane Foster');
const cmeComplianceReport = generateCMEComplianceReport(clinicians);
printResult('CME compliance report', cmeComplianceReport);

const hiringReport = generateHiringReport(employees);
printResult('Hiring report', hiringReport);

const nonOnboardedEmployees = filterEmployeesNotOnboarded(employees);
printResult('Employees not onboarded', nonOnboardedEmployees);

const employeesSortedByDaysDesc = sortEmployeesByDaysToHire(employees, 'desc');
printResult('Employees sorted by days-to-hire (desc)', employeesSortedByDaysDesc);

const departments: Array<Employee['department']> = [
  'clinical-operations',
  'patient-experience',
  'revenue-cycle',
  'compliance',
  'people-workforce',
  'technology',
  'executive',
];

for (const department of departments) {
  printResult(
    `Employees by department: ${department}`,
    filterEmployeesByDepartment(employees, department),
  );
}

printResult('Employees by country US', filterEmployeesByCountry(employees, 'US'));
printResult('Employees by country UK', filterEmployeesByCountry(employees, 'UK'));

printSection('7. VALIDATIONS');
const validAppointment: Appointment = appointments[0];
const invalidAppointment: Appointment = { ...appointments[0], durationMinutes: 200 };
const invalidDeniedClaim: Claim = { ...claims[0], status: 'denied', denialReason: null };
const invalidPaidInvoice: UKInvoice = { ...ukInvoices[0], status: 'paid', paidAt: null };
const invalidUnderagePatient: Patient = {
  ...patients[0],
  id: 'patient-underage',
  dateOfBirth: '2011-01-01',
};
const invalidOnboardingEmployee: Employee = {
  ...employees[0],
  isOnboarded: true,
  complianceTrainingComplete: false,
};
const clinicianCMECheck: Clinician = clinicians[3];

printResult('validateAppointment (valid)', validateAppointment(validAppointment, patients, clinics));
printResult('validateAppointment (duration=200)', validateAppointment(invalidAppointment, patients, clinics));
printResult('validateClaim (denied + null reason)', validateClaim(invalidDeniedClaim, clinics));
printResult('validateUKInvoice (paid + null paidAt)', validateUKInvoice(invalidPaidInvoice, clinics));
printResult('validatePatient (age 15)', validatePatient(invalidUnderagePatient));
printResult('validateEmployeeOnboarding (onboarded without training)', validateEmployeeOnboarding(invalidOnboardingEmployee));
printResult('validateClinicianCME (seed sample)', validateClinicianCME(clinicianCMECheck));

printSection('8. SEARCH DEMONSTRATIONS');
printResult('linearSearchPatientById existing', linearSearchPatientById(patients, 'patient-001'));
printResult('linearSearchPatientById missing', linearSearchPatientById(patients, 'patient-999'));

printResult('linearSearchAppointmentByPatient existing', linearSearchAppointmentByPatient(appointments, 'patient-001'));
printResult('linearSearchAppointmentByPatient missing', linearSearchAppointmentByPatient(appointments, 'patient-999'));

printResult('linearSearchClaimById existing', linearSearchClaimById(claims, 'claim-001'));
printResult('linearSearchClaimById missing', linearSearchClaimById(claims, 'claim-999'));

printResult('linearSearchEmployeeById existing', linearSearchEmployeeById(employees, 'employee-001'));
printResult('linearSearchEmployeeById missing', linearSearchEmployeeById(employees, 'employee-999'));

const appointmentsSortedAsc = sortAppointmentsByDate(appointments, 'asc');
const appointmentBinaryHit = binarySearchSortedAppointmentsByDate(
  appointmentsSortedAsc,
  appointmentsSortedAsc[0]?.scheduledAt ?? '1900-01-01T00:00:00Z',
);
const appointmentBinaryMiss = binarySearchSortedAppointmentsByDate(
  appointmentsSortedAsc,
  '2099-01-01T00:00:00Z',
);
printResult('binarySearchSortedAppointmentsByDate existing index', appointmentBinaryHit);
printResult('binarySearchSortedAppointmentsByDate missing index', appointmentBinaryMiss);

printSection('9. ADDITIONAL DATA OPERATIONS');
printResult('Clinics by country US', filterClinicsByCountry(clinics, 'US'));
printResult('Clinics by country UK', filterClinicsByCountry(clinics, 'UK'));
printResult('Active clinics by US_EHR', filterActiveClinicsByEHR(clinics, 'US_EHR'));
printResult('Active clinics by UK_EHR', filterActiveClinicsByEHR(clinics, 'UK_EHR'));

printResult('Patients sorted by registration date asc', sortPatientsByRegistrationDate(patients, 'asc'));
printResult('Patients sorted by registration date desc', sortPatientsByRegistrationDate(patients, 'desc'));

printResult('UK invoices sorted by amount due asc', sortUKInvoicesByAmountDue(ukInvoices, 'asc'));
printResult('UK invoices sorted by amount due desc', sortUKInvoicesByAmountDue(ukInvoices, 'desc'));
