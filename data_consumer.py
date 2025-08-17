import json
from kafka import KafkaConsumer
import psycopg2
from psycopg2 import sql
import os

# Kafka consumer setup
consumer = KafkaConsumer(
    'iot_sensor_data',
    bootstrap_servers='localhost:9092',
    auto_offset_reset='earliest',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

# Update these connection details with your Railway TimescaleDB credentials
conn_details = {
    "dbname": "railway", # <-- Replace with the value of PGDATABASE
    "user": "railway",   # <-- Replace with the value of PGUSER
    "password": "q6ggvrn5hkoxcotn7qmlq3ois8ps277x",  # <-- Replace with the value of PGPASSWORD
    "host": "shinkansen.proxy.rlwy.net",   # <-- Replace with the value of PGHOST
    "port": "26961"    # <-- Replace with the value of PGPORT
}

print("Attempting to connect to Railway database...")
try:
    conn = psycopg2.connect(**conn_details)
    cursor = conn.cursor()
    print("Successfully connected to Railway database.")

    # Create a hypertable in the database if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_data (
            timestamp BIGINT NOT NULL,
            device_id VARCHAR(50) NOT NULL,
            device_type VARCHAR(50),
            temperature FLOAT,
            vibration_level FLOAT,
            pressure FLOAT
        );
    """)

    # Convert the table to a hypertable for time-series optimization
    cursor.execute("SELECT create_hypertable('sensor_data', 'timestamp', if_not_exists => TRUE);")
    conn.commit()
    print("Hypertable 'sensor_data' created or already exists.")

except Exception as e:
    print(f"Error connecting to Railway database: {e}")
    exit()

print("Starting data consumption from Kafka...")
try:
    for message in consumer:
        data = message.value

        # Prepare the INSERT statement
        insert_query = sql.SQL("""
            INSERT INTO sensor_data (
                timestamp,
                device_id,
                device_type,
                temperature,
                vibration_level,
                pressure
            ) VALUES (%s, %s, %s, %s, %s, %s);
        """)

        # Execute the query with the data
        cursor.execute(insert_query, (
            data['timestamp'],
            data['device_id'],
            data['device_type'],
            data['temperature'],
            data['vibration_level'],
            data['pressure']
        ))

        conn.commit()

        print(f"Inserted data for device {data['device_id']}")

except KeyboardInterrupt:
    print("Stopping data consumer.")
finally:
    cursor.close()
    conn.close()
    consumer.close()
