package patient_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import patient_service.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Patient findByPatientId(String patientId);
}