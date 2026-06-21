"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linearSearchPatientById = linearSearchPatientById;
exports.linearSearchAppointmentByPatient = linearSearchAppointmentByPatient;
exports.linearSearchClaimById = linearSearchClaimById;
exports.linearSearchClinicianByLicence = linearSearchClinicianByLicence;
exports.linearSearchEmployeeById = linearSearchEmployeeById;
exports.binarySearchSortedClaimsByAmount = binarySearchSortedClaimsByAmount;
exports.binarySearchSortedAppointmentsByDate = binarySearchSortedAppointmentsByDate;
exports.binarySearchSortedComplianceByRisk = binarySearchSortedComplianceByRisk;
function linearSearchPatientById(patients, id) {
    for (const patient of patients) {
        if (patient.id === id) {
            return patient;
        }
    }
    return null;
}
function linearSearchAppointmentByPatient(appointments, patientId) {
    for (const appointment of appointments) {
        if (appointment.patientId === patientId) {
            return appointment;
        }
    }
    return null;
}
function linearSearchClaimById(claims, id) {
    for (const claim of claims) {
        if (claim.id === id) {
            return claim;
        }
    }
    return null;
}
function linearSearchClinicianByLicence(clinicians, licenceNumber) {
    for (const clinician of clinicians) {
        if (clinician.licenceNumber === licenceNumber) {
            return clinician;
        }
    }
    return null;
}
function linearSearchEmployeeById(employees, id) {
    for (const employee of employees) {
        if (employee.id === id) {
            return employee;
        }
    }
    return null;
}
// Input must already be sorted by amountBilled in ascending order.
function binarySearchSortedClaimsByAmount(sortedClaims, targetAmount) {
    let left = 0;
    let right = sortedClaims.length - 1;
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const value = sortedClaims[middle].amountBilled;
        if (value === targetAmount) {
            return middle;
        }
        if (value < targetAmount) {
            left = middle + 1;
        }
        else {
            right = middle - 1;
        }
    }
    return -1;
}
// Input must already be sorted by scheduledAt in ascending order.
function binarySearchSortedAppointmentsByDate(sortedAppointments, targetDate) {
    const targetTime = new Date(targetDate).getTime();
    if (Number.isNaN(targetTime)) {
        return -1;
    }
    let left = 0;
    let right = sortedAppointments.length - 1;
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const value = new Date(sortedAppointments[middle].scheduledAt).getTime();
        if (value === targetTime) {
            return middle;
        }
        if (value < targetTime) {
            left = middle + 1;
        }
        else {
            right = middle - 1;
        }
    }
    return -1;
}
// Input must already be sorted by riskScore in ascending order.
function binarySearchSortedComplianceByRisk(sortedEvents, targetRisk) {
    let left = 0;
    let right = sortedEvents.length - 1;
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const value = sortedEvents[middle].riskScore;
        if (value === targetRisk) {
            return middle;
        }
        if (value < targetRisk) {
            left = middle + 1;
        }
        else {
            right = middle - 1;
        }
    }
    return -1;
}
