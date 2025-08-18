# IoT Predictive Maintenance Dashboard

This project is a complete, end-to-end solution for a predictive maintenance system. It demonstrates how to build a modern data engineering pipeline, integrate a machine learning model, and visualize real-time data in a live dashboard.

## 🚀 Live Demo
You can view the live, working version of this dashboard here:
[View Live Dashboard]
(https://iot-maintenance.onrender.com/)

## ✨ Key Features

* **End-to-End Data Pipeline:** A robust system that moves simulated sensor data through a streaming platform and into a live database.

* **Real-time Predictions:** A machine learning model that predicts equipment failure in real-time.

* **Interactive Dashboard:** A multi-page, visually appealing dashboard built with React that provides live data graphs and manual prediction capabilities.

* **Scalable Architecture:** The project is designed with a modular architecture, making it easy to scale or adapt to different use cases.

* **Full Deployment:** The entire project is deployed on free cloud services, making it publicly accessible and professional.

## 🛠️ Technology Stack
* **Frontend:** React, Recharts (for charts), Tailwind CSS

* **Backend:** Python, FastAPI

* **Database:** TimescaleDB (on Railway)

* **Streaming:** Apache Kafka (local simulation)

* **Deployment:** Git, Render, Docker

## 📈 Project Architecture
* The project follows a modern, real-time data architecture.

* A Python simulator generates sensor data (temperature, vibration, pressure).

* The data is sent to a local Apache Kafka broker.

* A Python consumer reads the data from Kafka and inserts it into a live TimescaleDB database hosted on Render.

* A Python FastAPI API, also hosted on Render, loads a pre-trained machine learning model.

* The React frontend dashboard fetches data from the live database and makes real-time predictions from the API.

## 💡 Future Improvements
* This project can be further enhanced by:

* Implementing continuous retraining of the AI model to improve its accuracy over time.

* Adding a more sophisticated anomaly detection model to automatically detect abnormal behavior.

* Building a user authentication system to protect the dashboard from unauthorized access.

* Creating a multi-device monitoring system to track the health of multiple machines simultaneously.

## ⚙️ Installation and Setup
This project can be run locally using Docker and Python.

Clone the repository:

git clone https://github.com/Somyasharmatech/iot-predictive-maintenance.git
cd iot-predictive-maintenance

Set up the Docker environment:

docker-compose up -d

Run the Python scripts:

# In one terminal, run the simulator
python iot_simulator.py

# In a separate terminal, run the consumer
python data_consumer.py
