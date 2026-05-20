package training.iqgateway.serviceimpl;

import org.springframework.stereotype.Service;
import training.iqgateway.entities.BillItem;
import training.iqgateway.repository.BillItemRepository;
import training.iqgateway.service.BillItemService;

import java.util.List;
import java.util.Optional;

@Service
public class BillItemServiceImpl implements BillItemService {
    private final BillItemRepository repo;

    public BillItemServiceImpl(BillItemRepository repo) {
        this.repo = repo;
    }

    @Override
    public BillItem save(BillItem item) {
        return repo.save(item);
    }

    @Override
    public List<BillItem> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<BillItem> findById(String id) {
        return repo.findById(id);
    }

    @Override
    public BillItem findByBillItemId(Integer billItemId) {
        return repo.findByBillItemId(billItemId);
    }

    @Override
    public List<BillItem> findByBillId(Integer billId) {
        return repo.findByBillId(billId);
    }

    @Override
    public void deleteById(String id) {
        repo.deleteById(id);
    }
}
