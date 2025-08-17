import pandas as pd
import psycopg2
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib


# Database connection details
conn_details = {
    "dbname": "iot_data",
    "user": "user",
    "password": "password",
    "host": "localhost",
    "port": "5432"
}

# SQL query to load data from the sensor_data table
query = "SELECT * FROM sensor_data ORDER BY timestamp;"

print("Connecting to TimescaleDB and loading data...")
try:
    conn = psycopg2.connect(**conn_details)
    df = pd.read_sql(query, conn, index_col='timestamp')
    conn.close()
    print(f"Data loaded successfully! Total rows: {len(df)}")
except Exception as e:
    print(f"Error loading data from TimescaleDB: {e}")
    exit()

# --- Feature Engineering and Label Creation ---
# Create a simple "is_failure" label for our model to predict.
# We'll consider a device at risk of failure if its vibration level is high.
FAILURE_THRESHOLD = 8.5
df['is_failure'] = (df['vibration_level'] > FAILURE_THRESHOLD).astype(int)
print("\nAdded 'is_failure' label based on vibration level.")

# --- Data Splitting ---
# Define features (X) and target (y)
features = ['temperature', 'vibration_level', 'pressure']
X = df[features]
y = df['is_failure']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
print(f"Data split: {len(X_train)} training samples, {len(X_test)} testing samples.")

# --- Model Training ---
print("\nTraining Random Forest Classifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
print("Model training complete.")

# --- Model Evaluation ---
print("\nEvaluating model performance...")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

model_filename = 'predictive_maintenance_model.joblib'
joblib.dump(model, model_filename)
print(f"\nModel saved to {model_filename}")