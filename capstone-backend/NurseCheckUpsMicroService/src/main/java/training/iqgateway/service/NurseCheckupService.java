package training.iqgateway.service;

import java.util.List;
import java.util.Optional;

import training.iqgateway.entities.NurseCheckup;

public interface NurseCheckupService {
	
		/**
	 * Creates a new nurse checkup.
	 *
	 * @param checkup the nurse checkup to create
	 * @return the created nurse checkup
	 */
	

    NurseCheckup createCheckup(NurseCheckup checkup);

    Optional<NurseCheckup> getCheckupById(String id);

    NurseCheckup updateCheckup(String id, NurseCheckup checkup);

    void deleteCheckup(String id);

    List<NurseCheckup> getAllCheckups();

    Optional<NurseCheckup> getCheckupByAppointmentId(String appointmentId);
}
