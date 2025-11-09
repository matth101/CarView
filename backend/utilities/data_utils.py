from typing import List, Optional, Tuple
from pydantic import BaseModel
import pandas as pd


# --- Input payload ---
class VehicleFilterRequest(BaseModel):
    vehicle_types: Optional[List[str]] = None  # e.g., ["Car", "SUV"]
    price_range: Optional[Tuple[int, int]] = None    # (min_price, max_price)
    mpg_range: Optional[Tuple[int, int]] = None      # (min_mpg, max_mpg)
    seating_options: Optional[List[int]] = None  # [4,5,6,...]
    preferences_text: Optional[str] = ""        # free-text preferences

def load_vehicle_data(vehicle_data_path) -> pd.DataFrame:
    """
    Load the vehicle data from the CSV path specified in config.yaml.
    Read-only: returns a copy to prevent modification.
    """
    if not vehicle_data_path:
        raise FileNotFoundError("CSV path not set in config.yaml")
    vehicle_data = pd.read_csv(vehicle_data_path)
    return vehicle_data.copy()

def filter_vehicles(df: pd.DataFrame, filters: VehicleFilterRequest) -> pd.DataFrame:
    """
    Filters the vehicles DataFrame based on user input.
    """
    filtered = df.copy()

    if filters.vehicle_types:
        filtered = filtered[filtered["category"].isin(filters.vehicle_types)]
    if filters.price_range and len(filters.price_range) == 2:
        filtered = filtered[
            (filtered["msrp"] >= filters.price_range[0]) & 
            (filtered["msrp"] <= filters.price_range[1])
        ]
    if filters.mpg_range and len(filters.mpg_range) == 2:
        filtered = filtered[
            (filtered["mpg_combined"] >= filters.mpg_range[0]) & 
            (filtered["mpg_combined"] <= filters.mpg_range[1])
        ]
    if filters.seating_options:
        filtered = filtered[filtered["seating"].isin(filters.seating_options)]

    return filtered
