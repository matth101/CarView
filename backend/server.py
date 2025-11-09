from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from utilities.data_utils import VehicleFilterRequest, filter_vehicles, load_vehicle_data
from utilities.LLM_utils import pick_best_cars, get_recommended_filters, get_gemini_client, get_model_name
from typing import List, Tuple
import uvicorn
from pathlib import Path
from dotenv import load_dotenv
from typing import List, Tuple
from google import genai
from pydantic import BaseModel


load_dotenv(dotenv_path="./dev.env")
vehicle_data_path = Path("./data/toyota_vehicles.csv")

app = FastAPI(title="Find Your Dream Toyota API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatLogsRequest(BaseModel):
    conversation: List[Tuple[int, str]]

@app.get("/vehicles")
def get_all_vehicles():
    df = load_vehicle_data(vehicle_data_path)
    return df.to_dict(orient="records")

@app.get("/vehicle/{full_model}")
def get_vehicle_by_model(full_model: str):
    df = load_vehicle_data(vehicle_data_path)
    result = df[df["full_model"].str.lower() == full_model.lower()]
    if result.empty:
        return {"error": "Vehicle not found"}
    return result.to_dict(orient="records")[0]

@app.post("/recommend_cars")
def recommend_cars(
    filters: VehicleFilterRequest,
    top_n: int = Query(5, description="Number of cars to recommend")
):
    print(" Received filter request:", filters.dict())
    
    df = load_vehicle_data(vehicle_data_path)
    print(f"Loaded {len(df)} vehicles from database")

    # Apply filters
    filtered_df = filter_vehicles(df, filters)
    print(f" After filtering: {len(filtered_df)} vehicles match criteria")

    # Use Gemini to pick top matches
    best = pick_best_cars(filtered_df, filters.preferences_text, top_n)
    print(f" Returning {len(best)} recommendations")

    return {"recommendations": best}

@app.post("/recommend_filters")
def recommend_filters(request: ChatLogsRequest):
    print("📝 Received conversation:", request.conversation)
    
    # Convert [(0, text), (1, text)] to [("user", text), ("assistant", text)]
    chat_logs = [
        ("user" if label == 0 else "assistant", text) 
        for label, text in request.conversation
    ]
    
    print("🔄 Processing chat logs...")
    filters = get_recommended_filters(chat_logs)
    
    result = {
        "vehicle_types": filters.vehicle_types or [],
        "price_range": list(filters.price_range) if filters.price_range else [15000, 90000],
        "mpg_range": list(filters.mpg_range) if filters.mpg_range else [15, 60],
        "seating_options": filters.seating_options or [],
        "preferences_text": filters.preferences_text or ""
    }
    
    print("✅ Returning filters:", result)
    return result

@app.websocket("/chat")
async def chat_with_user(websocket: WebSocket):
    """
    WebSocket endpoint to chat with a user and stream responses from Gemini.
    Client sends messages as JSON: {"role": "user", "message": "text"}
    """
    await websocket.accept()
    chat_logs: List[Tuple[str, str]] = []

    initial_prompt = """
    You are the Assistant in the following conversation, and are trying to help gather information about the user in order
    to help them find out what the right car would be for them. During this conversation, some things you could look for is
    vehicle types, mpg range, price range, number of seats, sporty vs. family car, etc. Just try to understand what they
    need to use the car for, and whether they want more or less options, and what kind of options they might want.
    """

    # Initialize Gemini model
    gemini_client = get_gemini_client()

    try:
        while True:
            data = await websocket.receive_json()
            role = data.get("role", "user")
            message = data.get("message", "")

            chat_logs.append((role, message))

            # Construct a prompt from chat_logs for Gemini
            prompt = initial_prompt + "\n"
            prompt += "\n".join([f"{r}: {m}" for r, m in chat_logs if r in ("user", "assistant")])
            prompt += "\nAssistant:"

            # Streaming callback function
            async def send_token(token: str):
                print(token)
                await websocket.send_json({"role": "assistant", "message": token, "stream": True})

            # Use Gemini streaming API
            async for token in gemini_client.models.generate_content_stream(
                model=get_model_name(),
                contents=prompt,
            ):
                await send_token(token.text)

            # Mark end of stream
            await websocket.send_json({"role": "assistant", "message": "", "stream": False})

    except WebSocketDisconnect:
        print("User disconnected from chat")

def main():
    """Launch FastAPI server with uvicorn when run as `python server.py`."""
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()