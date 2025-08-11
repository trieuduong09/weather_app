const APP_ID = 'cd85e45575070e6dd12423575e748da2';
const DEFAULT_VALUE = '--';
const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');

const loadingSpinner = document.querySelector('.loading-spinner');


searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            updateWeatherUI(data);
        });
});

function updateDateTime() {
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const day = days[now.getDay()];
    const date = now.toLocaleDateString('vi-VN');
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('current-date').textContent = `${day}, ${date}`;
    document.getElementById('current-time').textContent = time;                
}
updateDateTime();
setInterval(updateDateTime, 1000);

window.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            (error) => {
                fetchWeatherByCity('Ho Chi Minh');
            }
        );
    } else {
        fetchWeatherByCity('Ho Chi Minh');
    }
});

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=metric&lang=vi`;
    fetch(url)
        .then(res => res.json())
        .then(data => updateWeatherUI(data));
}

function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}&units=metric&lang=vi`;
    fetch(url)
        .then(res => res.json())
        .then(data => updateWeatherUI(data));
}

function updateWeatherUI(data) {
    cityName.textContent = data.name || DEFAULT_VALUE;
    weatherState.textContent = data.weather?.[0]?.description || DEFAULT_VALUE;
    weatherIcon.src = data.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        : '';
    temperature.textContent = data.main?.temp !== undefined
        ? Math.round(data.main.temp)
        : DEFAULT_VALUE;
    humidity.textContent = data.main?.humidity !== undefined
        ? data.main.humidity
        : DEFAULT_VALUE;
    windSpeed.textContent = data.wind?.speed !== undefined
        ? (data.wind.speed * 3.6).toFixed(2)
        : DEFAULT_VALUE;
    sunrise.textContent = data.sys?.sunrise
        ? moment.unix(data.sys.sunrise).format('H:mm')
        : DEFAULT_VALUE;
    sunset.textContent = data.sys?.sunset
        ? moment.unix(data.sys.sunset).format('H:mm')
        : DEFAULT_VALUE;
}

function showLoading() {
    loadingSpinner.style.display = 'flex';
}
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function fetchWeatherByCoords(lat, lon) {
    showLoading();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=metric&lang=vi`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            updateWeatherUI(data);
            hideLoading();
        })
        .catch(() => hideLoading());
}

function fetchWeatherByCity(city) {
    showLoading();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APP_ID}&units=metric&lang=vi`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            updateWeatherUI(data);
            hideLoading();
        })
        .catch(() => hideLoading());
}