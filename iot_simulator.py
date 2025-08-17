import time
import json
import random
from faker import Faker
from kafka import KafkaProducer

fake = Faker()
producer = KafkaProducer(bootstrap_servers='localhost:9092',
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

devices = [
    {'id': f'device_{i}', 'type': fake.word(ext_word_list=['motor', 'pump', 'generator']) }
    for i in range(1, 6)
]

print("Starting IoT data simulation...")
try:
    while True:
        for device in devices:
            data = {
                'device_id': device['id'],
                'device_type': device['type'],
                'timestamp': int(time.time() * 1000),
                'temperature': round(random.uniform(50, 110), 2),
                'vibration_level': round(random.uniform(1.0, 10.0), 2),
                'pressure': round(random.uniform(15, 70), 2)
            }

            if random.random() < 0.05:
                data['vibration_level'] = round(random.uniform(11.0, 15.0), 2)
                print(f"Anomaly detected for {device['id']}! Vibration: {data['vibration_level']}")

            producer.send('iot_sensor_data', value=data)

        time.sleep(1)

except KeyboardInterrupt:
    print("Stopping IoT data simulation.")
    producer.close()