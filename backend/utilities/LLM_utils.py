import os
import pandas as pd
import json
import re
from typing import List, Tuple
from google import genai
from utilities.data_utils import VehicleFilterRequest

def pick_best_cars(df: pd.DataFrame, preferences_text: str, top_n: int = 9) -> List[dict]:
    """
    Uses Gemini to pick the best cars based on user textual preferences.
    Returns top_n cars info as a list of dictionaries.
    """
    if df.empty:
        return []

    # Construct car list text for Gemini to read
    car_list_text = "\n".join(
        [f"- {row['full_model']}: {row['description']}" for _, row in df.iterrows()]
    )

    prompt = f"""
You are a car expert assistant. Here is a list of cars and their descriptions:

{car_list_text}

User preferences: {preferences_text}

From this list, recommend the top {top_n} cars that best match the user's preferences.
Return ONLY the exact names of the cars in a valid JSON array (e.g. ["Camry XLE", "RAV4 Hybrid", "Highlander Limited"]).
"""

    # Initialize Gemini model
    model = get_gemini_client()

    response = model.models.generate_content(
        model=get_model_name(),
        contents=prompt,
    )

    # Print raw response for debugging
    print(response.text)

    # --- Robust JSON parsing ---
    raw_text = response.text.strip()

    # Extract JSON array using regex
    match = re.search(r'\[.*\]', raw_text, re.DOTALL)
    if match:
        json_text = match.group(0)
    else:
        json_text = "[]"

    try:
        car_names = json.loads(json_text)
    except json.JSONDecodeError:
        car_names = []

    car_dict = df.set_index("full_model").to_dict(orient="index")

    # Keep only cars Gemini returned, in the same order
    best_matched = [
        {"full_model": name, **car_dict[name]} 
        for name in car_names 
        if name in car_dict
    ]

    return best_matched

def get_recommended_filters(chat_logs: List[Tuple[str]]) -> VehicleFilterRequest:
    """
    Use Gemini to summarize chat logs and suggest filter values for VehicleFilterRequest.
    chat_logs: List of tuples (speaker, message), e.g., [("user", "I want a fast SUV")]
    """
    # Build a single chat summary
    chat_text = "\n".join([f"{speaker}: {msg}" for speaker, msg in chat_logs])
    
    prompt = f"""
You are a vehicle recommendation assistant. Based on the following chat conversation with a user, 
suggest reasonable filter values for a VehicleFilterRequest object:

{chat_text}

Return a JSON object with the following keys:
- vehicle_types: list of vehicle types (e.g., ["Car", "SUV"]) that best match the user's preferences
- price_range: tuple with (min_price, max_price) in USD
- mpg_range: tuple with (min_mpg, max_mpg)
- seating_options: list of integers indicating reasonable seating options
- preferences_text: a short summary of the user's preferences as free text

Only return a valid JSON object.
"""

    # Initialize Gemini client
    client = get_gemini_client()

    response = client.models.generate_content(
        model=get_model_name(),
        contents=prompt
    )

    # Extract text
    raw_text = response.text.strip()

    # Extract JSON array using regex
    match = re.search(r'\{.*\}', raw_text, re.DOTALL)
    if match:
        json_text = match.group(0)
        print("Gemini output:", json_text)
    else:
        json_text = "[]"
        print("Gemini output:", raw_text)



    # Parse JSON safely
    try:
        filters_dict = json.loads(json_text)
    except json.JSONDecodeError:
        filters_dict = {}

    # Construct VehicleFilterRequest
    vehicle_filter = VehicleFilterRequest(
        vehicle_types=filters_dict.get("vehicle_types"),
        price_range=tuple(filters_dict.get("price_range")) if filters_dict.get("price_range") else None,
        mpg_range=tuple(filters_dict.get("mpg_range")) if filters_dict.get("mpg_range") else None,
        seating_options=filters_dict.get("seating_options"),
        preferences_text=filters_dict.get("preferences_text", "")
    )

    return vehicle_filter

def get_gemini_client():
    return genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def get_model_name():
    return os.environ.get("GEMINI_MODEL")