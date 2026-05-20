package training.iqgateway.entities;


import java.time.Instant;
import java.util.List;

public class ScheduleUpdatePayload {
    private String doctorId;
    private List<Instant> leaveDates;
    private List<DailySlotDTO> dailySlots;

    // Default constructor
    public ScheduleUpdatePayload() {}

    // Getters and Setters
    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public List<Instant> getLeaveDates() {
        return leaveDates;
    }

    public void setLeaveDates(List<Instant> leaveDates) {
        this.leaveDates = leaveDates;
    }

    public List<DailySlotDTO> getDailySlots() {
        return dailySlots;
    }

    public void setDailySlots(List<DailySlotDTO> dailySlots) {
        this.dailySlots = dailySlots;
    }
}