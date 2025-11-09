from utilities.data_utils import *
from utilities.LLM_utils import *
from pathlib import Path
from dotenv import load_dotenv


load_dotenv(dotenv_path="./dev.env")
vehicle_data_path = Path("./data/toyota_vehicles.csv")

# chat_logs = [
#     ("user", "I'm looking for a sporty vehicle that can accelerate quickly, but I also need it to be practical for daily commuting."),
#     ("response", "Got it! Do you have a preference for the type of vehicle, like a sedan, SUV, or coupe? And what kind of budget are you aiming for?"),
#     ("user", "I think a small SUV or a sporty sedan would be good. My budget is around $25,000 to $40,000."),
#     ("response", "Great! How important is fuel efficiency for you? Are you looking for something very efficient, or is moderate okay?"),
#     ("user", "Moderate is okay. I still want it to feel sporty, but I’d like to avoid a gas guzzler."),
#     ("response", "Understood. What about seating? Do you usually carry 2, 4, or more passengers?"),
#     ("user", "Mostly 2-4 people, occasionally 5."),
#     ("response", "Perfect! To summarize, you're looking for a sporty small SUV or sedan, budget $25k-$40k, moderate fuel efficiency, and seating for 2-5 people. Anything else you'd like in terms of features or style?"),
#     ("user", "I’d like something that has modern tech features, maybe a good infotainment system, and a sleek exterior."),
#     ("response", "Excellent! I now have a clear picture of your preferences and can recommend vehicles that match these criteria.")
# ]

# filters = get_recommended_filters(chat_logs)

# print(filters)

vehicle_filter = VehicleFilterRequest(
    vehicle_types=["Car"],
    price_range=(20000, 40000),
    mpg_range=None,
    seating_options=[],
    preferences_text="A sporty vehicle, that can accelerate fast."
)

top_n = 9

df = load_vehicle_data(vehicle_data_path)

# Apply filters
filtered_df = filter_vehicles(df, vehicle_filter)

# Use Gemini to pick top matches
best = pick_best_cars(filtered_df, vehicle_filter.preferences_text, top_n)

print(best)

