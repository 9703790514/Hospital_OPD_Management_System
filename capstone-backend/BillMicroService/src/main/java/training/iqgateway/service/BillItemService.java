package training.iqgateway.service;

import training.iqgateway.entities.BillItem;
import java.util.List;
import java.util.Optional;

public interface BillItemService {
    BillItem save(BillItem item);

    List<BillItem> findAll();

    Optional<BillItem> findById(String id);               // For the MongoDB ObjectId (_id field)

    BillItem findByBillItemId(Integer billItemId);        // For business id (eg. 'id' field in doc)

    List<BillItem> findByBillId(Integer billId);

    void deleteById(String id);
}
