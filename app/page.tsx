<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyPollenPal - Daily Pollen Levels & Forecasts</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
            color: #2d3748;
            line-height: 1.6;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
        }

        header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            text-decoration: none;
            color: #718096;
            font-weight: 500;
            transition: color 0.2s ease;
        }

        .nav-links a:hover {
            color: #2d3748;
        }

        .hero {
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            color: white;
            padding: 4rem 0;
            text-align: center;
        }

        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .hero-subtitle {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            opacity: 0.9;
        }

        .hero p {
            font-size: 1.1rem;
            margin-bottom: 3rem;
            opacity: 0.8;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .search-container {
            max-width: 500px;
            margin: 0 auto 2rem;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            border: none;
            border-radius: 50px;
            outline: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .search-btn {
            position: absolute;
            right: 8px;
            top: 8px;
            padding: 0.75rem 1.5rem;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .search-btn:hover {
            background: #0051D5;
            transform: translateY(-1px);
        }

        .use-location-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            width: 100%;
            padding: 1rem;
            margin-top: 1rem;
            background: rgba(255, 255, 255, 0.15);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .use-location-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.5);
        }

        .main-content {
            padding: 3rem 0;
        }

        .content-card {
            background: white;
            border-radius: 16px;
            padding: 2.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #f1f3f4;
        }

        .location-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .location-header h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.5rem;
        }

        .last-updated {
            color: #718096;
            font-size: 0.9rem;
        }

        .pollen-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .pollen-card {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .pollen-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .pollen-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #22c55e, #84cc16);
        }

        .pollen-card.moderate::before {
            background: linear-gradient(90deg, #eab308, #f97316);
        }

        .pollen-card.high::before {
            background: linear-gradient(90deg, #f97316, #ef4444);
        }

        .pollen-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        }

        .pollen-type {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }

        .pollen-level {
            font-size: 3rem;
            font-weight: 800;
            color: #007AFF;
            margin-bottom: 0.5rem;
            line-height: 1;
        }

        .pollen-status {
            color: #718096;
            font-weight: 500;
            font-size: 1rem;
        }

        .forecast-section {
            margin-top: 3rem;
        }

        .section-title {
            font-size: 2rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 2rem;
            text-align: center;
        }

        .forecast-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1.5rem;
        }

        .forecast-day {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem 1rem;
            text-align: center;
            transition: all 0.2s ease;
        }

        .forecast-day:hover {
            border-color: #007AFF;
            background: #f0f9ff;
        }

        .day-name {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 0.5rem;
        }

        .day-level {
            font-size: 1.3rem;
            font-weight: 700;
            color: #007AFF;
        }

        .data-sources {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            margin-top: 3rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .data-sources h3 {
            font-size: 1.3rem;
            color: #2d3748;
            margin-bottom: 1.5rem;
            font-weight: 600;
        }

        .source-logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 3rem;
            flex-wrap: wrap;
        }

        .source-logo {
            color: #718096;
            font-weight: 600;
            font-size: 1rem;
            padding: 0.5rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: #f8fafc;
        }

        .features-section {
            margin-top: 4rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 20px;
            padding: 3rem 2rem;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .feature-item {
            text-align: center;
            padding: 2rem;
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: #007AFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            margin: 0 auto 1rem;
        }

        .feature-content h3 {
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }

        .feature-content p {
            color: #718096;
            line-height: 1.6;
        }

        .cta-section {
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
            border-radius: 20px;
            margin: 3rem 0;
        }

        .cta-section h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .cta-section p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .cta-button {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: white;
            color: #007AFF;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        footer {
            background: #2d3748;
            color: white;
            padding: 3rem 0 2rem;
            margin-top: 4rem;
        }

        .footer-content {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 2rem;
        }

        .footer-brand h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: white;
        }

        .footer-description {
            color: #a0aec0;
            line-height: 1.6;
        }

        .footer-links h4 {
            color: white;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .footer-links a {
            display: block;
            color: #a0aec0;
            text-decoration: none;
            margin-bottom: 0.5rem;
            transition: color 0.2s ease;
        }

        .footer-links a:hover {
            color: white;
        }

        .footer-bottom {
            border-top: 1px solid #4a5568;
            padding-top: 2rem;
            text-align: center;
            color: #a0aec0;
            font-size: 0.9rem;
        }

        .loading {
            text-align: center;
            padding: 3rem;
            color: #718096;
        }

        .error {
            background: #fed7d7;
            color: #9b2c2c;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            margin: 1rem 0;
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .content-card {
                padding: 2rem;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .source-logos {
                gap: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <a href="#" class="logo">🤧 mypollenpal</a>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#forecast">Forecast</a>
                <a href="#about">About</a>
            </div>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1>Is your pollen level safe today?</h1>
                <p class="hero-subtitle">#1 pollen tracking for real life</p>
                <p>One click to find out exactly what's in your air, anywhere in the United States. Your personal pollen companion for better allergy management.</p>
                
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Enter your ZIP code or city..." id="locationInput">
                    <button class="search-btn" onclick="searchLocation()">🔍 Search</button>
                    <button class="use-location-btn" onclick="useMyLocation()">
                        📍 Use my location
                    </button>
                </div>
            </div>
        </section>

        <section class="main-content">
            <div class="container">
                <div class="content-card" id="currentData">
                    <div class="location-header">
                        <h2 id="currentLocation">Carmel, Indiana</h2>
                        <p class="last-updated" id="lastUpdated">Last updated: Today at 12:00 PM</p>
                    </div>

                    <div class="pollen-grid" id="pollenGrid">
                        <div class="pollen-card high">
                            <div class="pollen-icon">🌳</div>
                            <div class="pollen-type">Tree Pollen</div>
                            <div class="pollen-level" id="treeLevel">4</div>
                            <div class="pollen-status" id="treeStatus">High</div>
                        </div>
                        <div class="pollen-card moderate">
                            <div class="pollen-icon">🌱</div>
                            <div class="pollen-type">Grass Pollen</div>
                            <div class="pollen-level" id="grassLevel">2</div>
                            <div class="pollen-status" id="grassStatus">Low</div>
                        </div>
                        <div class="pollen-card">
                            <div class="pollen-icon">🌿</div>
                            <div class="pollen-type">Weed Pollen</div>
                            <div class="pollen-level" id="weedLevel">1</div>
                            <div class="pollen-status" id="weedStatus">Very Low</div>
                        </div>
                    </div>
                </div>

                <div class="content-card forecast-section">
                    <h3 class="section-title">5-Day Forecast</h3>
                    <div class="forecast-grid" id="forecastGrid">
                        <div class="forecast-day">
                            <div class="day-name">Today</div>
                            <div class="day-level">High</div>
                        </div>
                        <div class="forecast-day">
                            <div class="day-name">Tomorrow</div>
                            <div class="day-level">Moderate</div>
                        </div>
                        <div class="forecast-day">
                            <div class="day-name">Saturday</div>
                            <div class="day-level">Low</div>
                        </div>
                        <div class="forecast-day">
                            <div class="day-name">Sunday</div>
                            <div class="day-level">Moderate</div>
                        </div>
                        <div class="forecast-day">
                            <div class="day-name">Monday</div>
                            <div class="day-level">High</div>
                        </div>
                    </div>
                </div>

                <div class="data-sources">
                    <h3>Powered by trusted sources</h3>
                    <div class="source-logos">
                        <div class="source-logo">Google Pollen API</div>
                        <div class="source-logo">NOAA Weather</div>
                        <div class="source-logo">CDC Health Data</div>
                    </div>
                </div>

                <div class="features-section">
                    <h3 class="section-title">How MyPollenPal Works</h3>
                    <div class="features-grid">
                        <div class="feature-item">
                            <div class="feature-icon">📍</div>
                            <div class="feature-content">
                                <h3>1. Check Your Location</h3>
                                <p>Enter your ZIP code or use your current location to get hyperlocal pollen data for your exact area.</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📊</div>
                            <div class="feature-content">
                                <h3>2. View Real-Time Data</h3>
                                <p>See current pollen levels for trees, grass, and weeds with easy-to-understand severity ratings.</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🔮</div>
                            <div class="feature-content">
                                <h3>3. Plan Ahead</h3>
                                <p>Check the 5-day forecast to plan outdoor activities and medication schedules in advance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cta-section">
                    <h2>Ready to take control of your allergies?</h2>
                    <p>Join thousands who trust MyPollenPal for daily pollen insights</p>
                    <a href="#" class="cta-button" onclick="document.getElementById('locationInput').focus()">
                        Get Started Today →
                    </a>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>🤧 mypollenpal</h3>
                    <p class="footer-description">
                        Providing accurate, real-time pollen data to help allergy sufferers make informed decisions about their daily activities and health management.
                    </p>
                </div>
                <div class="footer-links">
                    <h4>Product</h4>
                    <a href="#home">Pollen Tracker</a>
                    <a href="#forecast">Forecasts</a>
                    <a href="#api">API Access</a>
                </div>
                <div class="footer-links">
                    <h4>Company</h4>
                    <a href="#about">About Us</a>
                    <a href="#contact">Contact</a>
                    <a href="#privacy">Privacy</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>Built with Google Pollen API, NOAA Weather Data, and CDC Health Insights | © 2025 MyPollenPal</p>
            </div>
        </div>
    </footer>

    <script>
        // Google Pollen API integration (placeholder)
        async function fetchPollenData(location = 'Carmel, Indiana') {
            try {
                showLoading();
                
                // This will call your Next.js API route once it's set up
                // const response = await fetch(`/api/pollen?location=${encodeURIComponent(location)}`);
                // const data = await response.json();
                
                // For now, using sample data
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({
                            location: location,
                            lastUpdated: new Date().toLocaleString(),
                            current: {
                                tree: { level: 4, status: "High" },
                                grass: { level: 2, status: "Low" },
                                weed: { level: 1, status: "Very Low" }
                            },
                            forecast: [
                                { day: "Today", level: "High" },
                                { day: "Tomorrow", level: "Moderate" },
                                { day: "Saturday", level: "Low" },
                                { day: "Sunday", level: "Moderate" },
                                { day: "Monday", level: "High" }
                            ]
                        });
                    }, 800);
                });
                
            } catch (error) {
                console.error('Error fetching pollen data:', error);
                throw error;
            }
        }

        function updatePollenDisplay(data) {
            document.getElementById('currentLocation').textContent = data.location;
            document.getElementById('lastUpdated').textContent = `Last updated: ${data.lastUpdated}`;

            // Update current pollen levels
            document.getElementById('treeLevel').textContent = data.current.tree.level;
            document.getElementById('treeStatus').textContent = data.current.tree.status;
            document.getElementById('grassLevel').textContent = data.current.grass.level;
            document.getElementById('grassStatus').textContent = data.current.grass.status;
            document.getElementById('weedLevel').textContent = data.current.weed.level;
            document.getElementById('weedStatus').textContent = data.current.weed.status;

            // Update forecast
            const forecastGrid = document.getElementById('forecastGrid');
            forecastGrid.innerHTML = '';
            data.forecast.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'forecast-day';
                dayElement.innerHTML = `
                    <div class="day-name">${day.day}</div>
                    <div class="day-level">${day.level}</div>
                `;
                forecastGrid.appendChild(dayElement);
            });
        }

        function showLoading() {
            const currentData = document.getElementById('currentData');
            currentData.innerHTML = '<div class="loading">Loading pollen data...</div>';
        }

        function showError(message) {
            const currentData = document.getElementById('currentData');
            currentData.innerHTML = `<div class="error">Error: ${message}</div>`;
        }

        async function searchLocation() {
            const input = document.getElementById('locationInput');
            const location = input.value.trim();
            
            if (!location) {
                alert('Please enter a location');
                return;
            }

            try {
                const data = await fetchPollenData(location);
                updatePollenDisplay(data);
            } catch (error) {
                showError('Unable to fetch pollen data. Please try again.');
            }
        }

        async function useMyLocation() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const data = await fetchPollenData(`${latitude},${longitude}`);
                        updatePollenDisplay(data);
                    } catch (error) {
                        showError('Unable to fetch pollen data for your location.');
                    }
                });
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        }

        // Handle Enter key in search input
        document.getElementById('locationInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLocation();
            }
        });

        // Initialize with sample data on page load
        document.addEventListener('DOMContentLoaded', async function() {
            try {
                const data = await fetchPollenData();
                updatePollenDisplay(data);
            } catch (error) {
                showError('Unable to load initial data');
            }
        });
    </script>
</body>
</html>
