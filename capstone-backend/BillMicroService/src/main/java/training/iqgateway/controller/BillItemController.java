package training.iqgateway.controller;

import org.springframework.web.bind.annotation.*;
import training.iqgateway.entities.BillItem;
import training.iqgateway.service.BillItemService;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bill-items")
public class BillItemController {
    private final BillItemService service;
    public BillItemController(BillItemService service) { this.service = service; }

    @GetMapping
    public List<BillItem> getAll() { return service.findAll(); }

    @GetMapping("/{_id}")
    public ResponseEntity<BillItem> getBy_Id(@PathVariable String _id) {
        Optional<BillItem> opt = service.findById(_id);
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
//    
//    @GetMapping("/item-id/{id}")
//    public ResponseEntity<BillItem> getById(@PathVariable String id) {
//        BillItem item = service.findById(id);
//        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
//    }


    @GetMapping("/bill/{billId}") // for all items of a bill
    public List<BillItem> getByBillId(@PathVariable Integer billId) {
        return service.findByBillId(billId);
    }

    @PostMapping
    public BillItem create(@RequestBody BillItem item) {
        return service.save(item);
    }

    @PutMapping("/{_id}")
    public ResponseEntity<BillItem> update(@PathVariable String _id, @RequestBody BillItem item) {
        return service.findById(_id).map(existing -> {
            item.setId(existing.getId());
            return ResponseEntity.ok(service.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{_id}")
    public ResponseEntity<Void> delete(@PathVariable String _id) {
        if (service.findById(_id).isPresent()) {
            service.deleteById(_id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
