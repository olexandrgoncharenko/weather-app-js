const apiKey = '7092ea4fc29b2c25884a529e3f9e9667';
const form = document.getElementById('form');
const input = document.getElementById('input');
const btn = document.getElementById('btn');
let inputCity;

const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];

const cityField = document.getElementById('city');
const dateField = document.getElementById('date');
const tempField = document.getElementById('temp');
const weatherField = document.getElementById('weather');
const visibilityField = document.getElementById('visibility');
const feelsFeald = document.getElementById('feels');
const humidityFeald = document.getElementById('humidity');
const windFeald = document.getElementById('wind');

const modal = document.querySelector('.form__modal');
const modalMessage = document.querySelector('.form__modal-message');
const closeBtn = document.querySelector('.close-modal');

const showWeather = (link) => {
    fetch(link).then((response) => {
        if(!response.ok) {
            showModal('Город не найден!');
            throw new Error(response.statusText);  
        } else {
            return response.json(); 
        } 
    })
    .then((data) => {
        const city = data.name;
        const country = data.sys.country;
        const dateNow = new Date(); 
        const dayWeek = days[dateNow.getDay()];
        const day = dateNow.getDate();
        const month = dateNow.getMonth() + 1;
        const year = dateNow.getFullYear();
        const temp = Math.round(data.main.temp);
        const weather = data.weather[0].description;
        const visibility = Math.round(data.visibility / 1000);
        const feels = Math.round(data.main.feels_like);
        const humidity = Math.round(data.main.humidity);        
        const wind = Math.round(data.wind.speed);
        const iconCode = data.weather[0].icon;
        const iconBox = document.querySelector('.item__top-img');
        iconBox.style.cssText = `
            background-image: url('../images/icons/${iconCode}.svg');  
        `;
        windFeald.innerHTML = `${wind}км/ч`;
        cityField.innerHTML = `${city}, ${country}`;
        dateField.innerHTML = `<span>${dayWeek}</span> ${day}/${month}/${year}`;
        tempField.innerHTML = `${temp} <span>°C</span>`;
        weatherField.innerHTML = weather;
        visibilityField.innerHTML = `${visibility}км`;
        feelsFeald.innerHTML = `${feels}°C`;    
        humidityFeald.innerHTML = `${humidity}%`;   
    })
    .catch(console.error);
}

let position = navigator.geolocation.getCurrentPosition((position) => { 
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude
    let querry = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ru`;
    showWeather(querry);
});

const showModal = (text) => {
    modal.classList.add('active');
    modalMessage.innerHTML = text;
}

const closeModal = () => {
    modal.classList.remove('active');
}

closeBtn.addEventListener('click', () => {
    closeModal();
});

document.addEventListener( 'click', (e) => {
	const withinModal = e.composedPath().includes(modal);
	if (!withinModal) {
		closeModal();
	}
});

document.addEventListener('keydown', function(e) {
	if( e.keyCode == 27 ){ 
		closeModal();
	}
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    inputCity = input.value.trim();
    if(inputCity.length < 1) {
        showModal('Поле не может быть пустым!');
    } else {
        closeModal();
        input.value = '';
        let querry = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric&lang=ru`;
        showWeather(querry);
    }
});

