"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = require("./data/seed");
const aggregations_1 = require("./functions/aggregations");
const filters_1 = require("./functions/filters");
const search_1 = require("./functions/search");
const sorting_1 = require("./functions/sorting");
const validations_1 = require("./functions/validations");
function printSection(title) {
    console.log('\n=======================================');
    console.log(title);
    console.log('=======================================');
}
function printResult(label, value) {
    console.log(`\n${label}`);
    console.log(JSON.stringify(value, null, 2));
}
console.log('═══════════════════════════════════════');
console.log('   HEALTHCORE DIGITAL — SYSTEM REPORT  ');
console.log('═══════════════════════════════════════');
printSection('1. EXECUTIVE SUMMARY — Dr. Sandra Okonkwo');
const executiveSummary = (0, aggregations_1.generateExecutiveSummary)(seed_1.clinics, seed_1.patients, seed_1.appointments, seed_1.claims, seed_1.clinicians, seed_1.employees, seed_1.complianceEvents);
printResult('Executive summary', executiveSummary);
printSection('2. CLINICAL OPERATIONS — Dr. Marcus Reid');
const documentationReport = (0, aggregations_1.generateDocumentationReport)(seed_1.clinicians);
printResult('Documentation report', documentationReport);
const nonCompliantCMEClinicians = (0, filters_1.filterCliniciansWithNonCompliantCME)(seed_1.clinicians);
printResult('Non-compliant CME clinicians', nonCompliantCMEClinicians);
const cliniciansByDocumentationDesc = (0, sorting_1.sortCliniciansByDocumentationTime)(seed_1.clinicians, 'desc');
printResult('Clinicians sorted by documentation time (desc)', cliniciansByDocumentationDesc);
const foundClinicianByLicence = (0, search_1.linearSearchClinicianByLicence)(seed_1.clinicians, 'US-TX-MR-001');
const missingClinicianByLicence = (0, search_1.linearSearchClinicianByLicence)(seed_1.clinicians, 'NOT-FOUND');
printResult('Linear search clinician by licence (existing)', foundClinicianByLicence);
printResult('Linear search clinician by licence (missing)', missingClinicianByLicence);
printResult('Clinicians by role physician', (0, filters_1.filterCliniciansByRole)(seed_1.clinicians, 'physician'));
printResult('Clinicians by clinic clinic-us-tx-1', (0, filters_1.filterCliniciansByClinic)(seed_1.clinicians, 'clinic-us-tx-1'));
printSection('3. PATIENT EXPERIENCE — Priya Nair');
const noShowReport = (0, aggregations_1.generateNoShowReport)(seed_1.appointments);
printResult('No-show report', noShowReport);
const highRiskAppointments = (0, filters_1.filterAppointmentsByNoShowRisk)(seed_1.appointments, 'high');
printResult('High-risk appointments', highRiskAppointments);
const unremindedHighRiskAppointments = (0, filters_1.filterUnremindedHighRiskAppointments)(seed_1.appointments);
printResult('Unreminded high-risk appointments', unremindedHighRiskAppointments);
const appointmentsSortedDesc = (0, sorting_1.sortAppointmentsByDate)(seed_1.appointments, 'desc');
printResult('Appointments sorted by date (desc)', appointmentsSortedDesc);
printResult('Appointments by status no-show', (0, filters_1.filterAppointmentsByStatus)(seed_1.appointments, 'no-show'));
printResult('Appointments by clinic clinic-us-tx-1', (0, filters_1.filterAppointmentsByClinic)(seed_1.appointments, 'clinic-us-tx-1'));
printResult('Appointments by date range (May 1-5)', (0, filters_1.filterAppointmentsByDateRange)(seed_1.appointments, '2026-05-01T00:00:00Z', '2026-05-05T23:59:59Z'));
printResult('Appointments sorted by clinic then date', (0, sorting_1.sortAppointmentsByClinicThenDate)(seed_1.appointments));
printSection('4. REVENUE CYCLE — Tom Callahan');
const revenueSummary = (0, aggregations_1.generateRevenueSummary)(seed_1.claims, seed_1.ukInvoices);
printResult('Revenue summary', revenueSummary);
const claimsDenialReport = (0, aggregations_1.generateClaimsDenialReport)(seed_1.claims);
printResult('Claims denial report', claimsDenialReport);
const deniedClaims = (0, filters_1.filterDeniedClaims)(seed_1.claims);
printResult('Denied claims', deniedClaims);
const manualClaims = (0, filters_1.filterManualSubmissions)(seed_1.claims);
printResult('Manual submissions', manualClaims);
const claimsSortedDesc = (0, sorting_1.sortClaimsByAmountBilled)(seed_1.claims, 'desc');
const claimsSortedAsc = (0, sorting_1.sortClaimsByAmountBilled)(seed_1.claims, 'asc');
printResult('Claims sorted by billed amount (desc)', claimsSortedDesc);
const claimsBinaryHit = (0, search_1.binarySearchSortedClaimsByAmount)(claimsSortedAsc, claimsSortedAsc[0]?.amountBilled ?? -1);
const claimsBinaryMiss = (0, search_1.binarySearchSortedClaimsByAmount)(claimsSortedAsc, 999999);
printResult('Binary search claims by billed amount (existing index)', claimsBinaryHit);
printResult('Binary search claims by billed amount (missing index)', claimsBinaryMiss);
printResult('Claims by status approved', (0, filters_1.filterClaimsByStatus)(seed_1.claims, 'approved'));
printResult('Claims by insurance type commercial', (0, filters_1.filterClaimsByInsuranceType)(seed_1.claims, 'commercial'));
printSection('5. COMPLIANCE — Claire Whitfield');
const complianceRiskReport = (0, aggregations_1.generateComplianceRiskReport)(seed_1.complianceEvents);
printResult('Compliance risk report', complianceRiskReport);
const unresolvedComplianceEvents = (0, filters_1.filterUnresolvedComplianceEvents)(seed_1.complianceEvents);
printResult('Unresolved compliance events', unresolvedComplianceEvents);
const highRiskComplianceEvents = (0, filters_1.filterHighRiskComplianceEvents)(seed_1.complianceEvents, 70);
printResult('High-risk compliance events (>70)', highRiskComplianceEvents);
const hipaaEvents = (0, filters_1.filterComplianceEventsByFramework)(seed_1.complianceEvents, 'HIPAA');
const ukGdprEvents = (0, filters_1.filterComplianceEventsByFramework)(seed_1.complianceEvents, 'UK_GDPR');
printResult('HIPAA events', hipaaEvents);
printResult('UK_GDPR events', ukGdprEvents);
const sortedComplianceAsc = (0, sorting_1.sortComplianceEventsByRiskScore)(seed_1.complianceEvents, 'asc');
printResult('Compliance events sorted by risk score (asc)', sortedComplianceAsc);
const complianceBinaryHit = (0, search_1.binarySearchSortedComplianceByRisk)(sortedComplianceAsc, sortedComplianceAsc[0]?.riskScore ?? -1);
const complianceBinaryMiss = (0, search_1.binarySearchSortedComplianceByRisk)(sortedComplianceAsc, 101);
printResult('Binary search compliance by risk (existing index)', complianceBinaryHit);
printResult('Binary search compliance by risk (missing index)', complianceBinaryMiss);
printSection('6. PEOPLE AND WORKFORCE — Diane Foster');
const cmeComplianceReport = (0, aggregations_1.generateCMEComplianceReport)(seed_1.clinicians);
printResult('CME compliance report', cmeComplianceReport);
const hiringReport = (0, aggregations_1.generateHiringReport)(seed_1.employees);
printResult('Hiring report', hiringReport);
const nonOnboardedEmployees = (0, filters_1.filterEmployeesNotOnboarded)(seed_1.employees);
printResult('Employees not onboarded', nonOnboardedEmployees);
const employeesSortedByDaysDesc = (0, sorting_1.sortEmployeesByDaysToHire)(seed_1.employees, 'desc');
printResult('Employees sorted by days-to-hire (desc)', employeesSortedByDaysDesc);
const departments = [
    'clinical-operations',
    'patient-experience',
    'revenue-cycle',
    'compliance',
    'people-workforce',
    'technology',
    'executive',
];
for (const department of departments) {
    printResult(`Employees by department: ${department}`, (0, filters_1.filterEmployeesByDepartment)(seed_1.employees, department));
}
printResult('Employees by country US', (0, filters_1.filterEmployeesByCountry)(seed_1.employees, 'US'));
printResult('Employees by country UK', (0, filters_1.filterEmployeesByCountry)(seed_1.employees, 'UK'));
printSection('7. VALIDATIONS');
const validAppointment = seed_1.appointments[0];
const invalidAppointment = { ...seed_1.appointments[0], durationMinutes: 200 };
const invalidDeniedClaim = { ...seed_1.claims[0], status: 'denied', denialReason: null };
const invalidPaidInvoice = { ...seed_1.ukInvoices[0], status: 'paid', paidAt: null };
const invalidUnderagePatient = {
    ...seed_1.patients[0],
    id: 'patient-underage',
    dateOfBirth: '2011-01-01',
};
const invalidOnboardingEmployee = {
    ...seed_1.employees[0],
    isOnboarded: true,
    complianceTrainingComplete: false,
};
const clinicianCMECheck = seed_1.clinicians[3];
printResult('validateAppointment (valid)', (0, validations_1.validateAppointment)(validAppointment, seed_1.patients, seed_1.clinics));
printResult('validateAppointment (duration=200)', (0, validations_1.validateAppointment)(invalidAppointment, seed_1.patients, seed_1.clinics));
printResult('validateClaim (denied + null reason)', (0, validations_1.validateClaim)(invalidDeniedClaim, seed_1.clinics));
printResult('validateUKInvoice (paid + null paidAt)', (0, validations_1.validateUKInvoice)(invalidPaidInvoice, seed_1.clinics));
printResult('validatePatient (age 15)', (0, validations_1.validatePatient)(invalidUnderagePatient));
printResult('validateEmployeeOnboarding (onboarded without training)', (0, validations_1.validateEmployeeOnboarding)(invalidOnboardingEmployee));
printResult('validateClinicianCME (seed sample)', (0, validations_1.validateClinicianCME)(clinicianCMECheck));
printSection('8. SEARCH DEMONSTRATIONS');
printResult('linearSearchPatientById existing', (0, search_1.linearSearchPatientById)(seed_1.patients, 'patient-001'));
printResult('linearSearchPatientById missing', (0, search_1.linearSearchPatientById)(seed_1.patients, 'patient-999'));
printResult('linearSearchAppointmentByPatient existing', (0, search_1.linearSearchAppointmentByPatient)(seed_1.appointments, 'patient-001'));
printResult('linearSearchAppointmentByPatient missing', (0, search_1.linearSearchAppointmentByPatient)(seed_1.appointments, 'patient-999'));
printResult('linearSearchClaimById existing', (0, search_1.linearSearchClaimById)(seed_1.claims, 'claim-001'));
printResult('linearSearchClaimById missing', (0, search_1.linearSearchClaimById)(seed_1.claims, 'claim-999'));
printResult('linearSearchEmployeeById existing', (0, search_1.linearSearchEmployeeById)(seed_1.employees, 'employee-001'));
printResult('linearSearchEmployeeById missing', (0, search_1.linearSearchEmployeeById)(seed_1.employees, 'employee-999'));
const appointmentsSortedAsc = (0, sorting_1.sortAppointmentsByDate)(seed_1.appointments, 'asc');
const appointmentBinaryHit = (0, search_1.binarySearchSortedAppointmentsByDate)(appointmentsSortedAsc, appointmentsSortedAsc[0]?.scheduledAt ?? '1900-01-01T00:00:00Z');
const appointmentBinaryMiss = (0, search_1.binarySearchSortedAppointmentsByDate)(appointmentsSortedAsc, '2099-01-01T00:00:00Z');
printResult('binarySearchSortedAppointmentsByDate existing index', appointmentBinaryHit);
printResult('binarySearchSortedAppointmentsByDate missing index', appointmentBinaryMiss);
printSection('9. ADDITIONAL DATA OPERATIONS');
printResult('Clinics by country US', (0, filters_1.filterClinicsByCountry)(seed_1.clinics, 'US'));
printResult('Clinics by country UK', (0, filters_1.filterClinicsByCountry)(seed_1.clinics, 'UK'));
printResult('Active clinics by US_EHR', (0, filters_1.filterActiveClinicsByEHR)(seed_1.clinics, 'US_EHR'));
printResult('Active clinics by UK_EHR', (0, filters_1.filterActiveClinicsByEHR)(seed_1.clinics, 'UK_EHR'));
printResult('Patients sorted by registration date asc', (0, sorting_1.sortPatientsByRegistrationDate)(seed_1.patients, 'asc'));
printResult('Patients sorted by registration date desc', (0, sorting_1.sortPatientsByRegistrationDate)(seed_1.patients, 'desc'));
printResult('UK invoices sorted by amount due asc', (0, sorting_1.sortUKInvoicesByAmountDue)(seed_1.ukInvoices, 'asc'));
printResult('UK invoices sorted by amount due desc', (0, sorting_1.sortUKInvoicesByAmountDue)(seed_1.ukInvoices, 'desc'));
