import { useEffect, useState } from "react";
import Search from "../search";
import weatherImg from '../pic/weather.jpg';

export default function Weather() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  async function fetchWeatherData(param) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${param}&appid=897ffd5fc259f8f96678c851d4a43cc9`
      );

      const data = await response.json();

      if (data) {
        setWeatherData(data);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  async function handleSearch() {
    fetchWeatherData(search);
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  useEffect(() => {
    fetchWeatherData("siliguri");
  }, []);

  console.log(weatherData);

  function cel(kelvin){
    return (kelvin - 273.15).toFixed(2);
  }

  function dayMonth(day){
    const date = new Date(day);

    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };

    const formatted = date.toLocaleDateString("en-US", options);
    return formatted;
  }

  return (
    <div className="main">
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      <div className="content">
      {loading ? (
        <div className="loading present">Loading...</div>
      ) : (
        <div className="present">
          <div className="city-name">
            <h2>
              {weatherData?.city?.name}, <span>{weatherData?.city?.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{getCurrentDate()}</span>
          </div>
          <div className="temp">{cel(weatherData?.list[0]?.main?.temp)}°C</div>
          <p className="feelsLike">Feels Like: {cel(weatherData?.list[0]?.main?.feels_like)}°C</p>
          <p className="description">
            {weatherData && weatherData.list[0] && weatherData.list[0].weather[0]
              ? weatherData.list[0].weather[0].description
              : ""}
          </p>
          <div className="weather-info">
            <div className="column">
              <div>
                <p className="wind">{weatherData?.list[0]?.wind?.speed}</p>
                <p>Wind Speed</p>
              </div>
            </div>
            <div className="column">
              <div>
                <p className="humidity">{weatherData?.list[0]?.main?.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="column">
              <div>
                <p className="pressure">{weatherData?.list[0]?.main?.pressure} hPa</p>
                <p>Pressure</p>
              </div>
            </div>
          </div>
          <div className="other">
              <ul>
                <li>Latitude : {weatherData?.city?.coord?.lat}°</li>
                <li>Longitude : {weatherData?.city?.coord?.lon}°</li>
                <li>Total Population : {weatherData?.city?.population} (Approx..)</li>
              </ul>
          </div>
          <div className="Image"><img src={weatherImg} alt="weather"/></div>
        </div>
      )}
    {weatherData && weatherData.list && weatherData.list.length > 0 && (
  <div className="weekend">
    <div className="forecast-section">
      <h3>5-Day Forecast of {weatherData.city.name}</h3>
      {
        (() => {
          const dailyForecast = [];
          const dates = new Set();

          for (const item of weatherData.list) {
            const date = item.dt_txt.split(" ")[0];
            if (!dates.has(date)) {
              dates.add(date);
              dailyForecast.push(item);
            }
          }

          return dailyForecast.slice(1, 6).map((item, index) => (
            <div
              className="forecast-card"
              style={{ animationDelay: `${index * 0.2}s` }}
              key={index}
            >
              <p className="day">{dayMonth(item.dt_txt)}</p>
              <div className="temp-icon">
                <p className="temp">{cel(item.main.temp)}°C</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                />
              </div>
              <p className="desc">{item.weather[0].description}</p>
            </div>
          ));
        })()
      }
    </div>
  </div>
)}

    </div>
    </div>
  );
}