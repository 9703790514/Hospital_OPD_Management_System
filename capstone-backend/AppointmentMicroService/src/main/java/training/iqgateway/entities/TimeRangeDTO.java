package training.iqgateway.entities;


import java.time.Instant;

public class TimeRangeDTO {
    private Instant startTime;
    private Instant endTime;

    // Default constructor
    public TimeRangeDTO() {}

    // Getters and Setters
    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }
}