import os

files_to_clean = [
    ("d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\BillingDesk\\BillingDeskConsultationBill.jsx", 4203),
    ("d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\BillingDesk\\BillingDeskGenerateBill.jsx", 4431),
    ("d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Doctor\\DoctorMySchedule.jsx", 2620),
    ("d:\\Capstone\\cap-stone-frontned\\capstone-opd\\src\\Patient\\HomePage.jsx", 1410)
]

print("=== Cleaning Large Files ===\n")

for filepath, start_line in files_to_clean:
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    original_count = len(lines)
    # Keep from line start_line-1 (0-indexed) to end
    cleaned_lines = lines[start_line - 1:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)
    
    deleted = original_count - len(cleaned_lines)
    print(f"✓ {filename}")
    print(f"  Original: {original_count} lines")
    print(f"  New: {len(cleaned_lines)} lines")
    print(f"  Deleted: {deleted} lines ({int(deleted/original_count*100)}% reduction)\n")

print("=== Cleanup Complete ===")
