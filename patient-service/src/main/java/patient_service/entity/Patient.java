package patient_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;
    private String name;
    private String room;

    @Column(name = "medical_condition")
    private String condition;

    private String mood;

    private boolean facilityRegistered;
    private String doctorName;
    private boolean hasActiveConcern;

    public Patient() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public boolean isFacilityRegistered() {
        return facilityRegistered;
    }

    public void setFacilityRegistered(boolean facilityRegistered) {
        this.facilityRegistered = facilityRegistered;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public boolean isHasActiveConcern() {
        return hasActiveConcern;
    }

    public void setHasActiveConcern(boolean hasActiveConcern) {
        this.hasActiveConcern = hasActiveConcern;
    }
}