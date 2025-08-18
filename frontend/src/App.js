import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A simple function to generate some initial data for demonstration
const generateMockData = (numPoints = 50) => {
    const data = [];
    const baseTemp = 80;
    const baseVib = 5;
    const basePress = 45;
    let hasAnomaly = false;

    for (let i = 0; i < numPoints; i++) {
        const timestamp = new Date(Date.now() - (numPoints - i) * 1000);
        let temp = baseTemp + Math.random() * 5 - 2.5;
        let vib = baseVib + Math.random() * 2 - 1;
        let press = basePress + Math.random() * 3 - 1.5;

        if (i > numPoints * 0.7 && !hasAnomaly) {
            if (Math.random() > 0.8) {
                hasAnomaly = true;
            }
        }
        if (hasAnomaly) {
            vib += (i - numPoints * 0.7) * 0.2 + Math.random() * 2;
        }

        data.push({
            timestamp: timestamp.toLocaleTimeString(),
            temperature: parseFloat(temp.toFixed(2)),
            vibration_level: parseFloat(vib.toFixed(2)),
            pressure: parseFloat(press.toFixed(2)),
        });
    }
    return data;
};

// This is the real API call to your deployed API
const getPrediction = async (data) => {
    try {
        const response = await fetch("https://iot-predictiction-api.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Prediction failed:", error);
        return {
            prediction: -1,
            probability_of_failure: 0,
            probability_of_normal: 0,
        };
    }
};

const Header = ({ currentPage, setCurrentPage }) => (
    <header className="bg-slate-900 border-b border-slate-700 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-indigo-400">
                IoT Dashboard
            </h1>
            <nav>
                <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                        currentPage === 'dashboard'
                            ? 'bg-indigo-600 text-white'
                            : 'text-indigo-200 hover:bg-slate-700'
                    }`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setCurrentPage('predict')}
                    className={`ml-4 px-4 py-2 rounded-md font-medium transition-colors ${
                        currentPage === 'predict'
                            ? 'bg-indigo-600 text-white'
                            : 'text-indigo-200 hover:bg-slate-700'
                    }`}
                >
                    Manual Prediction
                </button>
            </nav>
        </div>
    </header>
);

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="text-3xl text-indigo-400 h-8 w-8 fill-current">
        <path d="M16 16C16 7.163 23.163 0 32 0H208c17.67 0 32 14.33 32 32V256H288c12.94 0 24.62 7.032 30.63 18.04s5.986 24.41-1.411 35.34l-112 160c-7.402 10.93-19.08 18.04-32.02 18.04c-11.75 0-22.95-5.917-29.35-15.89l-128-192C-3.411 262.3-3.468 250.7 3.411 239.5L16 16zM208 64V224h16c6.164 0 11.23 3.659 13.56 9.497l12.44 32.55C252.1 278.4 251.1 281.8 248 284.5L136 450.5L152 288H112c-6.164 0-11.23-3.659-13.56-9.497l-12.44-32.55C83.92 233.6 84.87 230.2 88 227.5L208 64z"/>
    </svg>
);

const TachometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="text-3xl text-indigo-400 h-8 w-8 fill-current">
        <path d="M288 32C129 32 0 161.9 0 320c0 102.5 59.94 186.2 153.5 220.8l47.5-53.59c-30.82-12.5-54.78-36.95-69.69-67.65c-19.49-40.85-24.7-86.42-12.83-132.8c11.66-45.05 34.62-84.34 65.65-116.1L288 245.5L341.2 195c-29.83-29.68-68.61-46.61-110.2-46.61c-52.09 0-99.78 28.56-127.2 73.19l-49.82-41.21c17.5-27.1 40.87-50.6 67.57-70.19C168 111.4 223.5 96 288 96c141.6 0 256 114.4 256 256c0 43.15-10.77 84.8-31.57 122.9L545.9 451.9c32.75-57.9 50.1-124.9 50.1-193.9C576 161.9 447 32 288 32z"/>
    </svg>
);

const DashboardPage = ({ data, prediction }) => {
    const getStatusColor = (value) => {
        if (value > 0.7) return "#ef4444";
        if (value > 0.4) return "#eab308";
        return "#22c55e";
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Real-Time Prediction Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col justify-between">
                    <div className="flex items-center space-x-4 mb-4">
                        <BoltIcon />
                        <h2 className="text-xl font-semibold text-indigo-400">Live Prediction</h2>
                    </div>
                    {prediction ? (
                        <>
                            <p className={`text-5xl font-bold mb-2 text-center transition-colors duration-500 ${prediction.prediction === 1 ? 'text-red-500' : 'text-green-500'}`}>
                                {prediction.prediction === 1 ? 'Failure Imminent' : 'Normal Operation'}
                            </p>
                            <p className="text-lg text-center text-slate-400">
                                Confidence: {(prediction.probability_of_failure * 100).toFixed(2)}%
                            </p>
                        </>
                    ) : (
                        <p className="text-center text-lg text-slate-400">Loading prediction...</p>
                    )}
                </div>
                
                <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-400">Prob. of Failure</h2>
                    {prediction && (
                        <div className="w-full bg-slate-700 rounded-full h-8">
                            <div
                                className="h-8 rounded-full transition-all duration-500 flex items-center justify-center text-sm font-bold"
                                style={{
                                    width: `${(prediction.probability_of_failure * 100).toFixed(0)}%`,
                                    backgroundColor: getStatusColor(prediction.probability_of_failure),
                                }}
                            >
                                {(prediction.probability_of_failure * 100).toFixed(0)}%
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col justify-between">
                    <div className="flex items-center space-x-4 mb-4">
                        <TachometerIcon />
                        <h2 className="text-xl font-semibold text-indigo-400">Latest Vibration</h2>
                    </div>
                    {data.length > 0 && (
                        <p className="text-5xl font-bold text-center text-yellow-400">
                            {data[data.length - 1].vibration_level}
                        </p>
                    )}
                    <p className="text-lg text-center text-slate-400">
                        Current reading
                    </p>
                </div>
            </div>

            {/* Live Data Chart Section */}
            <div className="bg-slate-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-400">Live Sensor Data</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="timestamp" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#6366f1"
                            dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                            activeDot={{ stroke: '#fff', strokeWidth: 2, r: 6 }}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="vibration_level"
                            stroke="#eab308"
                            dot={{ stroke: '#eab308', strokeWidth: 2, r: 4 }}
                            activeDot={{ stroke: '#fff', strokeWidth: 2, r: 6 }}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="pressure"
                            stroke="#38bdf8"
                            dot={{ stroke: '#38bdf8', strokeWidth: 2, r: 4 }}
                            activeDot={{ stroke: '#fff', strokeWidth: 2, r: 6 }}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const ManualPredictionPage = ({ getManualPrediction }) => {
    const [formData, setFormData] = useState({ temperature: '', vibration_level: '', pressure: '' });
    const [apiPrediction, setApiPrediction] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: parseFloat(value) || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call the new prediction function with the form data
        getManualPrediction(formData)
            .then(result => setApiPrediction(result))
            .catch(err => console.error("API Prediction failed:", err));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-400">Get a Prediction</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                            <label className="block text-slate-400 mb-2" htmlFor="temperature">
                                Temperature
                            </label>
                            <input
                                type="number"
                                id="temperature"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2" htmlFor="vibration_level">
                                Vibration Level
                            </label>
                            <input
                                type="number"
                                id="vibration_level"
                                name="vibration_level"
                                value={formData.vibration_level}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2" htmlFor="pressure">
                                Pressure
                            </label>
                            <input
                                type="number"
                                id="pressure"
                                name="pressure"
                                value={formData.pressure}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Get Prediction
                    </button>
                </form>

                {apiPrediction && (
                    <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Prediction Result:</h3>
                        <p className={`text-3xl font-bold transition-colors duration-500 ${apiPrediction.prediction === 1 ? 'text-red-500' : 'text-green-500'}`}>
                            {apiPrediction.prediction === 1 ? 'Failure Imminent' : 'Normal Operation'}
                        </p>
                        <p className="text-lg text-slate-400">
                            Model Confidence: {(apiPrediction.probability_of_failure * 100).toFixed(2)}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [data, setData] = useState(generateMockData());
    const [prediction, setPrediction] = useState(null);

    // Update data and get prediction every few seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => {
                const newData = [...prevData.slice(1)];
                const lastData = newData[newData.length - 1];
                const timestamp = new Date(Date.now());

                let temp = lastData.temperature + Math.random() * 2 - 1;
                let vib = lastData.vibration_level + Math.random() * 1 - 0.5;
                let press = lastData.pressure + Math.random() * 1 - 0.5;

                // Ensure values stay within a reasonable range and simulate anomalies
                if (Math.random() > 0.98) {
                    vib = lastData.vibration_level + Math.random() * 5 + 3;
                }

                newData.push({
                    timestamp: timestamp.toLocaleTimeString(),
                    temperature: parseFloat(temp.toFixed(2)),
                    vibration_level: parseFloat(vib.toFixed(2)),
                    pressure: parseFloat(press.toFixed(2)),
                });

                return newData;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Use a separate effect for prediction on streaming data
    useEffect(() => {
        if (data.length > 0) {
            getPrediction(data[data.length - 1])
                .then(result => setPrediction(result))
                .catch(err => console.error("Prediction failed:", err));
        }
    }, [data]);

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen font-sans">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="pb-8">
                {currentPage === 'dashboard' ? (
                    <DashboardPage data={data} prediction={prediction} />
                ) : (
                    <ManualPredictionPage getManualPrediction={getPrediction} />
                )}
            </main>
        </div>
    );
};

export default App;
