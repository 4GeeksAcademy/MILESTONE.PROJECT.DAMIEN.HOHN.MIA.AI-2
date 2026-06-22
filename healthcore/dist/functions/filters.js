"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterClinicsByCountry = filterClinicsByCountry;
exports.filterActiveClinicsByEHR = filterActiveClinicsByEHR;
exports.filterAppointmentsByStatus = filterAppointmentsByStatus;
exports.filterAppointmentsByClinic = filterAppointmentsByClinic;
exports.filterAppointmentsByNoShowRisk = filterAppointmentsByNoShowRisk;
exports.filterAppointmentsByDateRange = filterAppointmentsByDateRange;
exports.filterUnremindedHighRiskAppointments = filterUnremindedHighRiskAppointments;
exports.filterClaimsByStatus = filterClaimsByStatus;
exports.filterDeniedClaims = filterDeniedClaims;
exports.filterClaimsByInsuranceType = filterClaimsByInsuranceType;
exports.filterManualSubmissions = filterManualSubmissions;
exports.filterCliniciansWithNonCompliantCME = filterCliniciansWithNonCompliantCME;
exports.filterCliniciansByRole = filterCliniciansByRole;
exports.filterCliniciansByClinic = filterCliniciansByClinic;
exports.filterEmployeesByDepartment = filterEmployeesByDepartment;
exports.filterEmployeesByCountry = filterEmployeesByCountry;
exports.filterEmployeesNotOnboarded = filterEmployeesNotOnboarded;
exports.filterComplianceEventsByFramework = filterComplianceEventsByFramework;
exports.filterUnresolvedComplianceEvents = filterUnresolvedComplianceEvents;
exports.filterHighRiskComplianceEvents = filterHighRiskComplianceEvents;
function filterClinicsByCountry(clinics, country) {
    return clinics.filter((clinic) => clinic.country === country);
}
function filterActiveClinicsByEHR(clinics, ehrSystem) {
    return clinics.filter((clinic) => clinic.isActive && clinic.ehrSystem === ehrSystem);
}
function filterAppointmentsByStatus(appointments, status) {
    return appointments.filter((appointment) => appointment.status === status);
}
function filterAppointmentsByClinic(appointments, clinicId) {
    return appointments.filter((appointment) => appointment.clinicId === clinicId);
}
function filterAppointmentsByNoShowRisk(appointments, risk) {
    return appointments.filter((appointment) => appointment.noShowRisk === risk);
}
function filterAppointmentsByDateRange(appointments, startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) {
        return [];
    }
    return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.scheduledAt).getTime();
        if (Number.isNaN(appointmentDate)) {
            return false;
        }
        return appointmentDate >= start && appointmentDate <= end;
    });
}
function filterUnremindedHighRiskAppointments(appointments) {
    return appointments.filter((appointment) => appointment.noShowRisk === 'high' && !appointment.reminderSent);
}
function filterClaimsByStatus(claims, status) {
    return claims.filter((claim) => claim.status === status);
}
function filterDeniedClaims(claims) {
    return claims.filter((claim) => claim.status === 'denied');
}
function filterClaimsByInsuranceType(claims, insuranceType) {
    return claims.filter((claim) => claim.insuranceType === insuranceType);
}
function filterManualSubmissions(claims) {
    return claims.filter((claim) => claim.isManualSubmission);
}
function filterCliniciansWithNonCompliantCME(clinicians) {
    return clinicians.filter((clinician) => !clinician.cmeRecord.isCompliant);
}
function filterCliniciansByRole(clinicians, role) {
    return clinicians.filter((clinician) => clinician.role === role);
}
function filterCliniciansByClinic(clinicians, clinicId) {
    return clinicians.filter((clinician) => clinician.clinicId === clinicId);
}
function filterEmployeesByDepartment(employees, department) {
    return employees.filter((employee) => employee.department === department);
}
function filterEmployeesByCountry(employees, country) {
    return employees.filter((employee) => employee.country === country);
}
function filterEmployeesNotOnboarded(employees) {
    return employees.filter((employee) => !employee.isOnboarded);
}
function filterComplianceEventsByFramework(events, framework) {
    return events.filter((event) => event.framework === framework);
}
function filterUnresolvedComplianceEvents(events) {
    return events.filter((event) => !event.isResolved);
}
function filterHighRiskComplianceEvents(events, threshold) {
    return events.filter((event) => event.riskScore > threshold);
}
