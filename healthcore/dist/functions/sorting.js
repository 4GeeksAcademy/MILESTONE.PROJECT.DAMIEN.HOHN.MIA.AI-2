"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAppointmentsByDate = sortAppointmentsByDate;
exports.sortClaimsByAmountBilled = sortClaimsByAmountBilled;
exports.sortCliniciansByDocumentationTime = sortCliniciansByDocumentationTime;
exports.sortEmployeesByDaysToHire = sortEmployeesByDaysToHire;
exports.sortComplianceEventsByRiskScore = sortComplianceEventsByRiskScore;
exports.sortPatientsByRegistrationDate = sortPatientsByRegistrationDate;
exports.sortUKInvoicesByAmountDue = sortUKInvoicesByAmountDue;
exports.sortAppointmentsByClinicThenDate = sortAppointmentsByClinicThenDate;
function sortByDirection(left, right, direction) {
    return direction === 'asc' ? left - right : right - left;
}
function sortAppointmentsByDate(appointments, direction) {
    return [...appointments].sort((a, b) => {
        const left = new Date(a.scheduledAt).getTime();
        const right = new Date(b.scheduledAt).getTime();
        return sortByDirection(left, right, direction);
    });
}
function sortClaimsByAmountBilled(claims, direction) {
    return [...claims].sort((a, b) => sortByDirection(a.amountBilled, b.amountBilled, direction));
}
function sortCliniciansByDocumentationTime(clinicians, direction) {
    return [...clinicians].sort((a, b) => sortByDirection(a.dailyDocumentationMinutes, b.dailyDocumentationMinutes, direction));
}
function sortEmployeesByDaysToHire(employees, direction) {
    return [...employees].sort((a, b) => sortByDirection(a.daysToHire, b.daysToHire, direction));
}
function sortComplianceEventsByRiskScore(events, direction) {
    return [...events].sort((a, b) => sortByDirection(a.riskScore, b.riskScore, direction));
}
function sortPatientsByRegistrationDate(patients, direction) {
    return [...patients].sort((a, b) => {
        const left = new Date(a.registeredAt).getTime();
        const right = new Date(b.registeredAt).getTime();
        return sortByDirection(left, right, direction);
    });
}
function sortUKInvoicesByAmountDue(invoices, direction) {
    return [...invoices].sort((a, b) => sortByDirection(a.amountDue, b.amountDue, direction));
}
function sortAppointmentsByClinicThenDate(appointments) {
    return [...appointments].sort((a, b) => {
        const clinicCompare = a.clinicId.localeCompare(b.clinicId);
        if (clinicCompare !== 0) {
            return clinicCompare;
        }
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    });
}
