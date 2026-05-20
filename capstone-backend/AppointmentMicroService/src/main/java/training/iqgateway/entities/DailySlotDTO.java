package training.iqgateway.entities;

import java.util.List;

public class DailySlotDTO {
    private String day;
    private List<TimeRangeDTO> slots;
    private List<TimeRangeDTO> breakSlots;

    // Default constructor
    public DailySlotDTO() {}

    // Getters and Setters
    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public List<TimeRangeDTO> getSlots() {
        return slots;
    }

    public void setSlots(List<TimeRangeDTO> slots) {
        this.slots = slots;
    }

    public List<TimeRangeDTO> getBreakSlots() {
        return breakSlots;
    }

    public void setBreakSlots(List<TimeRangeDTO> breakSlots) {
        this.breakSlots = breakSlots;
    }
}