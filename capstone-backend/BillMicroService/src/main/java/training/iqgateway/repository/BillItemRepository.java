package training.iqgateway.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entities.BillItem;

public interface BillItemRepository extends MongoRepository<BillItem, String>{
	
	List<BillItem> findByBillId(Integer billId);
	BillItem findByBillItemId(Integer billItemId);

}
