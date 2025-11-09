import json
import csv

# Load the JSON files
with open("submodel_to_base.json", "r", encoding="utf-8") as f:
    full_to_base = json.load(f)

with open("toyota_base_models.json", "r", encoding="utf-8") as f:
    base_data = json.load(f)

# Load the new MSRP/description info
with open("toyota_vehicle_submodels.json", "r", encoding="utf-8") as f:
    model_info = json.load(f)

# Prepare CSV rows
rows = []
for full_name, base_name in full_to_base.items():
    if base_name in base_data:
        data = base_data[base_name]
        mpg = data.get("mpg_estimated", {}).get("combined") if data.get("mpg_estimated") else None
        
        # Add msrp and description if available
        info = model_info.get(full_name, {})
        msrp = info.get("msrp")
        description = info.get("description")
        
        row = {
            "full_model": full_name,
            "base_model": base_name,
            "category": data.get("category"),
            "mpg_combined": mpg,
            "seating": data.get("seating"),
            "msrp": msrp,
            "description": description
        }
        rows.append(row)
    else:
        print(f"Failed to find base name for: {full_name}")

# Write to CSV
fieldnames = ["full_model", "base_model", "category", "mpg_combined", "seating", "msrp", "description"]
with open("toyota_vehicles.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("CSV saved as toyota_vehicles.csv")
