"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNoShowReport = generateNoShowReport;
exports.generateClaimsDenialReport = generateClaimsDenialReport;
exports.generateDocumentationReport = generateDocumentationReport;
exports.generateCMEComplianceReport = generateCMEComplianceReport;
exports.generateHiringReport = generateHiringReport;
exports.generateComplianceRiskReport = generateComplianceRiskReport;
exports.generateExecutiveSummary = generateExecutiveSummary;
exports.generateRevenueSummary = generateRevenueSummary;
function toPercentage(numerator, denominator) {
    if (denominator === 0) {
        return 0;
    }
    return (numerator / denominator) * 100;
}
function average(values) {
    if (values.length === 0) {
        return 0;
    }
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
}
function generateNoShowReport(appointments) {
    const totalAppointments = appointments.length;
    const noShowAppointments = appointments.filter((appointment) => appointment.status === 'no-show');
    const noShowCount = noShowAppointments.length;
    const noShowRate = toPercentage(noShowCount, totalAppointments);
    const noShowsByClinic = {};
    for (const appointment of noShowAppointments) {
        noShowsByClinic[appointment.clinicId] = (noShowsByClinic[appointment.clinicId] ?? 0) + 1;
    }
    const baselineLossPerRatePoint = 1800000 / 22;
    return {
        totalAppointments,
        noShowCount,
        noShowRate,
        noShowsByClinic,
        estimatedAnnualLoss: noShowRate * baselineLossPerRatePoint,
    };
}
function generateClaimsDenialReport(claims) {
    const totalClaims = claims.length;
    const deniedClaims = claims.filter((claim) => claim.status === 'denied');
    const deniedCount = deniedClaims.length;
    const denialRate = toPercentage(deniedCount, totalClaims);
    const industryBenchmark = 6.5;
    const denialsByInsuranceType = {};
    const denialReasons = {};
    for (const claim of deniedClaims) {
        denialsByInsuranceType[claim.insuranceType] = (denialsByInsuranceType[claim.insuranceType] ?? 0) + 1;
        if (claim.denialReason !== null) {
            denialReasons[claim.denialReason] = (denialReasons[claim.denialReason] ?? 0) + 1;
        }
    }
    const totalAmountDenied = deniedClaims.reduce((sum, claim) => sum + claim.amountBilled, 0);
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
function generateDocumentationReport(clinicians) {
    const totalClinicians = clinicians.length;
    const minutes = clinicians.map((clinician) => clinician.dailyDocumentationMinutes);
    const averageDailyMinutes = average(minutes);
    const maxDailyMinutes = minutes.length > 0 ? Math.max(...minutes) : 0;
    const minDailyMinutes = minutes.length > 0 ? Math.min(...minutes) : 0;
    const totalMinutesWastedDaily = minutes.reduce((sum, value) => sum + value, 0);
    const cliniciansAboveThreshold = clinicians.filter((clinician) => clinician.dailyDocumentationMinutes > 35).length;
    return {
        totalClinicians,
        averageDailyMinutes,
        maxDailyMinutes,
        minDailyMinutes,
        totalMinutesWastedDaily,
        cliniciansAboveThreshold,
    };
}
function generateCMEComplianceReport(clinicians) {
    const totalClinicians = clinicians.length;
    const compliantClinicians = clinicians.filter((clinician) => clinician.cmeRecord.isCompliant);
    const compliantCount = compliantClinicians.length;
    const nonCompliantCliniciansList = clinicians.filter((clinician) => !clinician.cmeRecord.isCompliant);
    const nonCompliantCount = nonCompliantCliniciansList.length;
    return {
        totalClinicians,
        compliantCount,
        nonCompliantCount,
        complianceRate: toPercentage(compliantCount, totalClinicians),
        averageHoursCompleted: average(clinicians.map((clinician) => clinician.cmeRecord.hoursCompleted)),
        averageHoursRequired: average(clinicians.map((clinician) => clinician.cmeRecord.hoursRequired)),
        nonCompliantClinicians: nonCompliantCliniciansList.map((clinician) => ({
            id: clinician.id,
            name: `${clinician.firstName} ${clinician.lastName}`,
            hoursShort: Math.max(0, clinician.cmeRecord.hoursRequired - clinician.cmeRecord.hoursCompleted),
            expiryDate: clinician.cmeRecord.expiryDate,
        })),
    };
}
function generateHiringReport(employees) {
    const totalEmployees = employees.length;
    const daysToHireValues = employees.map((employee) => employee.daysToHire);
    const averageDaysToHire = average(daysToHireValues);
    const maxDaysToHire = daysToHireValues.length > 0 ? Math.max(...daysToHireValues) : 0;
    const minDaysToHire = daysToHireValues.length > 0 ? Math.min(...daysToHireValues) : 0;
    const industryBenchmark = 27;
    const employeesNotOnboarded = employees.filter((employee) => !employee.isOnboarded).length;
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
function generateComplianceRiskReport(events) {
    const totalEvents = events.length;
    const unresolvedCount = events.filter((event) => !event.isResolved).length;
    const resolvedCount = totalEvents - unresolvedCount;
    const riskScores = events.map((event) => event.riskScore);
    const averageRiskScore = average(riskScores);
    const maxRiskScore = riskScores.length > 0 ? Math.max(...riskScores) : 0;
    const eventsByFramework = {};
    const eventsByType = {};
    for (const event of events) {
        eventsByFramework[event.framework] = (eventsByFramework[event.framework] ?? 0) + 1;
        eventsByType[event.eventType] = (eventsByType[event.eventType] ?? 0) + 1;
    }
    const highRiskUnresolved = events.filter((event) => event.riskScore > 70 && !event.isResolved).length;
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
function generateExecutiveSummary(clinics, patients, appointments, claims, clinicians, employees, complianceEvents) {
    const noShowReport = generateNoShowReport(appointments);
    const claimsDenialReport = generateClaimsDenialReport(claims);
    const documentationReport = generateDocumentationReport(clinicians);
    const cmeReport = generateCMEComplianceReport(clinicians);
    const hiringReport = generateHiringReport(employees);
    const complianceReport = generateComplianceRiskReport(complianceEvents);
    return {
        totalClinics: clinics.length,
        usClinics: clinics.filter((clinic) => clinic.country === 'US').length,
        ukClinics: clinics.filter((clinic) => clinic.country === 'UK').length,
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
function generateRevenueSummary(claims, invoices) {
    const usTotalBilled = claims.reduce((sum, claim) => sum + claim.amountBilled, 0);
    const usTotalReimbursed = claims.reduce((sum, claim) => sum + claim.amountReimbursed, 0);
    const ukTotalDue = invoices.reduce((sum, invoice) => sum + invoice.amountDue, 0);
    const ukTotalPaid = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
    const combinedRevenue = usTotalReimbursed + ukTotalPaid;
    const combinedTarget = 28000000;
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
