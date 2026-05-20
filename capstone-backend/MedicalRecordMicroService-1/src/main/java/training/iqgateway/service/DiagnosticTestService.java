package training.iqgateway.service;

import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.DiagnosticTest;

public interface DiagnosticTestService {
    DiagnosticTest save(DiagnosticTest test);
    List<DiagnosticTest> findAll();
    Optional<DiagnosticTest> findById(String id); // ID is String
    void deleteById(String id); // ID is String
    public List<DiagnosticTest> getTestsForRecord(String recordId); // recordId is String
}