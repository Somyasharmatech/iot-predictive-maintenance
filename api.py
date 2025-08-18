import os
import json
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

# Load the trained model from the joblib file
model = joblib.load("predictive_maintenance_model.joblib")
app = FastAPI()

# Define the data model for the incoming sensor data
class SensorData(BaseModel):
    temperature: Optional[float] = None
    vibration_level: Optional[float] = None
    pressure: Optional[float] = None

# Placeholder for mean values from your training data
# In a real-world scenario, you would load these from a file
MEAN_VALUES = {
    'temperature': 75.0,
    'vibration_level': 5.0,
    'pressure': 45.0,
}

# Thresholds for obvious failures (e.g., 2x the normal maximum)
MAX_THRESHOLDS = {
    'temperature': 200.0,
    'vibration_level': 15.0,
    'pressure': 100.0,
}

# This is a temporary endpoint to check if the API is running
@app.get("/")
def read_root():
    return {"message": "Predictive Maintenance API is running!"}

# Define the prediction endpoint for partial data
@app.post("/predict-partial")
def predict_partial_failure(data: SensorData):
    # Data validation: check for impossibly high values
    if (data.temperature and data.temperature > MAX_THRESHOLDS['temperature']) or \
       (data.vibration_level and data.vibration_level > MAX_THRESHOLDS['vibration_level']) or \
       (data.pressure and data.pressure > MAX_THRESHOLDS['pressure']):
        return {
            "prediction": 1,
            "probability_of_failure": 0.99,
            "probability_of_normal": 0.01,
        }

    # Prepare the data for the model
    input_data = pd.DataFrame([{
        'temperature': data.temperature if data.temperature is not None else MEAN_VALUES['temperature'],
        'vibration_level': data.vibration_level if data.vibration_level is not None else MEAN_VALUES['vibration_level'],
        'pressure': data.pressure if data.pressure is not None else MEAN_VALUES['pressure'],
    }])
    
    # Make a prediction with the trained model
    prediction = model.predict(input_data)
    probability = model.predict_proba(input_data)

    # Return the prediction and probabilities
    return {
        "prediction": int(prediction[0]),
        "probability_of_failure": probability[0][1],
        "probability_of_normal": probability[0][0]
    }
