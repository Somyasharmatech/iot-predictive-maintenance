import os
import json
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
import psycopg2

# Load the trained model from the joblib file
model = joblib.load("predictive_maintenance_model.joblib")
app = FastAPI()

# Define the data model for the incoming sensor data
class SensorData(BaseModel):
    temperature: float
    vibration_level: float
    pressure: float

# This is a temporary endpoint to check if the API is running
@app.get("/")
def read_root():
    return {"message": "Predictive Maintenance API is running!"}

# Define the prediction endpoint
@app.post("/predict")
def predict_failure(data: SensorData):
    # Prepare the data for the model
    input_data = pd.DataFrame([[data.temperature, data.vibration_level, data.pressure]],
                              columns=['temperature', 'vibration_level', 'pressure'])
    
    # Make a prediction
    prediction = model.predict(input_data)
    probability = model.predict_proba(input_data)

    # Return the prediction and probabilities
    return {
        "prediction": int(prediction[0]),
        "probability_of_failure": probability[0][1],
        "probability_of_normal": probability[0][0]
    }