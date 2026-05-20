package training.iqgateway.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "nurse_checkups")
public class NurseCheckup {

    @Id
    private String id;

    private String appointmentId;
    private String patientId;
    private Date date;
    private Vitals vitals;
    private String notes;
    private String nurseId;

    // Getters and setters for all fields

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Vitals getVitals() {
        return vitals;
    }

    public void setVitals(Vitals vitals) {
        this.vitals = vitals;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getNurseId() {
        return nurseId;
    }

    public void setNurseId(String nurseId) {
        this.nurseId = nurseId;
    }

    // Nested static class for Vitals
    public static class Vitals {
        private BloodPressure bloodPressure;
        private BloodSugar bloodSugar;
        private int pulseRate;
        private int respiratoryRate;
        private Temperature temperature;
        private OxygenSaturation oxygenSaturation;
        private double weightKg;
        private double heightCm;

        // Getters and setters for vitals fields

        public BloodPressure getBloodPressure() {
            return bloodPressure;
        }

        public void setBloodPressure(BloodPressure bloodPressure) {
            this.bloodPressure = bloodPressure;
        }

        public BloodSugar getBloodSugar() {
            return bloodSugar;
        }

        public void setBloodSugar(BloodSugar bloodSugar) {
            this.bloodSugar = bloodSugar;
        }

        public int getPulseRate() {
            return pulseRate;
        }

        public void setPulseRate(int pulseRate) {
            this.pulseRate = pulseRate;
        }

        public int getRespiratoryRate() {
            return respiratoryRate;
        }

        public void setRespiratoryRate(int respiratoryRate) {
            this.respiratoryRate = respiratoryRate;
        }

        public Temperature getTemperature() {
            return temperature;
        }

        public void setTemperature(Temperature temperature) {
            this.temperature = temperature;
        }

        public OxygenSaturation getOxygenSaturation() {
            return oxygenSaturation;
        }

        public void setOxygenSaturation(OxygenSaturation oxygenSaturation) {
            this.oxygenSaturation = oxygenSaturation;
        }

        public double getWeightKg() {
            return weightKg;
        }

        public void setWeightKg(double weightKg) {
            this.weightKg = weightKg;
        }

        public double getHeightCm() {
            return heightCm;
        }

        public void setHeightCm(double heightCm) {
            this.heightCm = heightCm;
        }

        // Nested static classes for nested vitals

        public static class BloodPressure {
            private int systolic;
            private int diastolic;
            private String unit;

            public int getSystolic() {
                return systolic;
            }

            public void setSystolic(int systolic) {
                this.systolic = systolic;
            }

            public int getDiastolic() {
                return diastolic;
            }

            public void setDiastolic(int diastolic) {
                this.diastolic = diastolic;
            }

            public String getUnit() {
                return unit;
            }

            public void setUnit(String unit) {
                this.unit = unit;
            }
        }

        public static class BloodSugar {
            private double value;
            private String unit;

            public double getValue() {
                return value;
            }

            public void setValue(double value) {
                this.value = value;
            }

            public String getUnit() {
                return unit;
            }

            public void setUnit(String unit) {
                this.unit = unit;
            }
        }

        public static class Temperature {
            private double value;
            private String unit;

            public double getValue() {
                return value;
            }

            public void setValue(double value) {
                this.value = value;
            }

            public String getUnit() {
                return unit;
            }

            public void setUnit(String unit) {
                this.unit = unit;
            }
        }

        public static class OxygenSaturation {
            private int value;
            private String unit;

            public int getValue() {
                return value;
            }

            public void setValue(int value) {
                this.value = value;
            }

            public String getUnit() {
                return unit;
            }

            public void setUnit(String unit) {
                this.unit = unit;
            }
        }
    }
}
