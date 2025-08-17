import joblib
from fastapi import FastAPI
from pydantic import BaseModel

# Load the trained model
model = joblib.load("predictive_maintenance_model.joblib")
app = FastAPI()

# Define the data model for the incoming sensor data
class SensorData(BaseModel):
    temperature: float
    vibration_level: float
    pressure: float

# Define the prediction endpoint
@app.post("/predict")
def predict_failure(data: SensorData):
    # Prepare the data for the model
    features = [[data.temperature, data.vibration_level, data.pressure]]

    # Make a prediction
    prediction = model.predict(features)
    probability = model.predict_proba(features)

    # Return the prediction and probabilities
    return {
        "prediction": int(prediction[0]),
        "probability_of_failure": probability[0][1],
        "probability_of_normal": probability[0][0]
    }