import kagglehub
from kagglehub import KaggleDatasetAdapter
import json
import math

# Load the dataset
print("Downloading dataset from Kaggle...")
path = kagglehub.dataset_download("shudhanshusingh/az-medicine-dataset-of-india")
print("Path to dataset files:", path)

# Find the CSV file
import os
csv_file = None
for file in os.listdir(path):
    if file.endswith('.csv'):
        csv_file = os.path.join(path, file)
        break

if not csv_file:
    print("CSV file not found in downloaded dataset")
    exit(1)

import pandas as pd
df = pd.read_csv(csv_file)

print(f"Loaded {len(df)} records. Processing for database seeding...")

# Clean and transform
medicines = []
for index, row in df.iterrows():
    # Only keep 1000 for seeding to avoid overloading initially
    if index >= 1000:
        break
        
    med = {
        "name": str(row.get("name", "")).strip()[:200],
        "manufacturer": str(row.get("manufacturer_name", "")).strip()[:200],
        "type": str(row.get("type", "")).strip()[:50],
        "pack_size": str(row.get("pack_size_label", "")).strip()[:100],
        "composition1": str(row.get("short_composition1", "")).strip()[:200],
        "is_discontinued": bool(row.get("Is_discontinued", False)),
    }
    
    # Handle price safely
    price_val = row.get("price(₹)")
    try:
        if not math.isnan(price_val):
            med["price"] = float(price_val)
        else:
            med["price"] = 0.0
    except:
        med["price"] = 0.0
        
    # Only add if we have a valid name
    if med["name"] and med["name"] != "nan":
        medicines.append(med)

# Write to JSON
with open("../data/seed_medicines.json", "w") as f:
    json.dump(medicines, f, indent=2)

print(f"Successfully saved {len(medicines)} clean records to ../data/seed_medicines.json")
