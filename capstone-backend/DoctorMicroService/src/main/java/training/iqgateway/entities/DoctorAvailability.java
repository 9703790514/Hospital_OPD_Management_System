package training.iqgateway.entities;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents the availability schedule for a doctor, including daily working hours,
 * breaks within those hours, and specific dates the doctor is on leave.
 */
@Document(collection = "doctor_availabilities")
public class DoctorAvailability {

    @Id
    private String id; // MongoDB's _id field

    private String doctorId; // Reference to the Doctor's _id

    private List<DailySlot> dailySlots; // List of daily availability slots

    private List<Instant> leaveDates; // List of specific dates the doctor is on leave (full day)

    @CreatedDate
    private Instant createdAt; // Timestamp when the document was created

    @LastModifiedDate
    private Instant updatedAt; // Timestamp when the document was last updated

    // Constructor
    public DoctorAvailability() {
    }

    public DoctorAvailability(String id, String doctorId, List<DailySlot> dailySlots, List<Instant> leaveDates, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.doctorId = doctorId;
        this.dailySlots = dailySlots;
        this.leaveDates = leaveDates;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public List<DailySlot> getDailySlots() {
        return dailySlots;
    }

    public List<Instant> getLeaveDates() {
        return leaveDates;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public void setDailySlots(List<DailySlot> dailySlots) {
        this.dailySlots = dailySlots;
    }

    public void setLeaveDates(List<Instant> leaveDates) {
        this.leaveDates = leaveDates;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Inner class to represent a daily slot structure for a doctor's availability.
     * This includes regular working slots and specific break slots within the day.
     */
    public static class DailySlot {
        private String day; // E.g., "MONDAY", "TUESDAY"
        private List<TimeRange> slots; // List of available time ranges for appointments
        private List<TimeRange> breakSlots; // List of time ranges where the doctor is on break within the day

        // Constructor
        public DailySlot() {
        }

        public DailySlot(String day, List<TimeRange> slots, List<TimeRange> breakSlots) {
            this.day = day;
            this.slots = slots;
            this.breakSlots = breakSlots;
        }

        // Getters
        public String getDay() {
            return day;
        }

        public List<TimeRange> getSlots() {
            return slots;
        }

        public List<TimeRange> getBreakSlots() {
            return breakSlots;
        }

        // Setters
        public void setDay(String day) {
            this.day = day;
        }

        public void setSlots(List<TimeRange> slots) {
            this.slots = slots;
        }

        public void setBreakSlots(List<TimeRange> breakSlots) {
            this.breakSlots = breakSlots;
        }
    }

    /**
     * Inner class to represent a time range with a start and end time.
     * Uses Instant to store time, which is suitable for MongoDB's ISODate.
     */
    public static class TimeRange {
        private Instant startTime;
        private Instant endTime;

        // Constructor
        public TimeRange() {
        }

        public TimeRange(Instant startTime, Instant endTime) {
            this.startTime = startTime;
            this.endTime = endTime;
        }

        // Getters
        public Instant getStartTime() {
            return startTime;
        }

        public Instant getEndTime() {
            return endTime;
        }

        // Setters
        public void setStartTime(Instant startTime) {
            this.startTime = startTime;
        }

        public void setEndTime(Instant endTime) {
            this.endTime = endTime;
        }
    }
}
