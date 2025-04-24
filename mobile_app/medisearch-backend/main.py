from fastapi import FastAPI
from pydantic import BaseModel
from medisearch_client import MediSearchClient
import uuid
import os
from dotenv import load_dotenv
import re

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))
print("API KEY:", os.getenv("MEDISEARCH_API_KEY"))
app = FastAPI()
client = MediSearchClient(api_key=os.getenv("MEDISEARCH_API_KEY"))


class QueryData(BaseModel):
    temperature: float
    age: str
    limbType: str
    painLevel: int
    numbnessLevel: int

@app.post("/recommend")
async def get_recommendation(data: QueryData):
    conversation_id = str(uuid.uuid4())
    
    # Construct the query with the received data
    query = (
        f"A patient aged {data.age} years, suffering from poor circulation, is experiencing a {data.limbType} limb with a temperature of {data.temperature}°C. "
        f"The patient reports a pain level of {data.painLevel} on a scale of 0-10 (0 = no pain, 10 = worst pain imaginable) and a numbness level of {data.numbnessLevel} on a scale of 0-10 (0 = normal sensation, 10 = complete numbness). "
        f"Please recommend the vibration session's frequency (in Hz), duration (in minutes), and provide a justification for the recommendation based on clinical research or evidence. "
        f"Note that the frequency should not exceed 166 Hz. "
        f"Return the response in the following format: "
        f"frequency: [recommended frequency in Hz], "
        f"duration: [recommended duration in minutes], "
        f"justification: [your detailed justification]."
    )

    # Send the query to MediSearchClient
    responses = client.send_message(
        conversation=[query],
        conversation_id=conversation_id
    )

    # Parse the response from the client
    for response in responses:
         if response["event"] == "llm_response":
            response_text = response["data"]

            # Use regex to extract frequency, duration, justification
            match_freq = re.search(r"frequency:\s*(.+?)\s*(?:\n|$)", response_text, re.IGNORECASE)
            match_dur = re.search(r"duration:\s*(.+?)\s*(?:\n|$)", response_text, re.IGNORECASE)
            match_just = re.search(r"justification:\s*(.+)", response_text, re.IGNORECASE | re.DOTALL)

            recommendation = {}

            if match_freq:
                recommendation["frequency"] = match_freq.group(1).strip()
            if match_dur:
                recommendation["duration"] = match_dur.group(1).strip()
            if match_just:
                recommendation["justification"] = match_just.group(1).strip()

            return recommendation or {"error": "Incomplete response parsed."}

    return {"error": "No valid response"}