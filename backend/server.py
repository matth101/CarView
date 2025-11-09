from fastapi import FastAPI, Query
from utilities.data_utils import VehicleFilterRequest, filter_vehicles, load_vehicle_data
from utilities.LLM_utils import pick_best_cars, get_recommended_filters
import uvicorn
from pathlib import Path
from dotenv import load_dotenv
from typing import List, Tuple


load_dotenv(dotenv_path="./dev.env")
vehicle_data_path = Path("./data/toyota_vehicles.csv")

app = FastAPI(title="Find Your Dream Toyota API")

@app.get("/vehicles")
def get_all_vehicles():
    df = load_vehicle_data()
    return df.to_dict(orient="records")

@app.get("/vehicle/{full_model}")
def get_vehicle_by_model(full_model: str):
    df = load_vehicle_data()
    result = df[df["full_model"].str.lower() == full_model.lower()]
    if result.empty:
        return {"error": "Vehicle not found"}
    return result.to_dict(orient="records")[0]


@app.get("/recommend_cars")
def recommend_cars(
    filters: VehicleFilterRequest,
    top_n: int = Query(3, description="Number of cars to recommend")
):
    df = load_vehicle_data()

    # Apply filters
    filtered_df = filter_vehicles(df, filters)

    # Use Gemini to pick top matches
    best = pick_best_cars(filtered_df, filters.preferences_text, top_n)

    return {"recommendations": best}

@app.get("/recommend_filters")
def recommend_filters(
    chat_logs: List[Tuple[str]] = ""
):
    
    filters = get_recommended_filters(chat_logs)

    return {"filters": filters}

def main():
    """Launch FastAPI server with uvicorn when run as `python server.py`."""
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()