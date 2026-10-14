package patient_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import patient_service.entity.Patient;
import patient_service.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientByPatientId(String patientId) {
        return patientRepository.findByPatientId(patientId);
    }

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }
}