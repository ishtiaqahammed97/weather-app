// user interface/ DOM related properties and methods
const UI = {
    loadSelector() {
        const cityElm = document.querySelector("#city");
        const cityInfoElm = document.querySelector("#w-city");
        const iconElm = document.querySelector("#w-icon");
        const temperatureElm = document.querySelector("#w-temp");
        const pressureElm = document.querySelector("#w-pressure");
        const humidityElm = document.querySelector("#w-humidity");
        const feelElm = document.querySelector("#w-feel");
        const formElm = document.querySelector("#form");
        const countryElm = document.querySelector("#country");
        const messageElm = document.querySelector("#messageWrapper");
        return {
            cityElm,
            cityInfoElm,
            iconElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
            formElm,
            countryElm,
            messageElm
        }
    },
    hideMessage() {
        const { messageElm } = this.loadSelector();
        setTimeout(() => {
            messageElm.innerHTML = '';
        }, 2000)
    },
    showMessage(msg) {
        const { messageElm } = this.loadSelector();
        const elm = `<div class="alert alert-danger">${msg} </div>`
        messageElm.innerHTML = elm;
        // hiding message after 2 seconds
        this.hideMessage()
    },

    validateInput(city, country) {
        if (city === "" || country === "") {
            // console.log('Error');
            this.showMessage('please provide necessary information');
            return false;
        }
        return true;
    },
    getInput() {
        const { cityElm, countryElm } = this.loadSelector();
        const city = cityElm.value;
        const country = countryElm.value;

        // validation of input
        const isValidated = this.validateInput(city, country);
        return { city, country, isValidated };
    },
    clearInput() {
        const { cityElm, countryElm } = this.loadSelector();
        cityElm.value = '';
        countryElm.value = '';
    },
    getIcon(iconCode) {
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
    },
    async getAndPopulateUI() {
        /// load data from localStorage
        const { city, country } = storage.getData()
        // setting to weatherData 
        weatherData.city = city;
        weatherData.country = country
        // calling API
        const data = await weatherData.getData()
        /// populate to UI
        this.populateUI(data);
    }
    ,
    populateUI(data) {
        const {
            cityInfoElm,
            iconElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
        } = this.loadSelector()
        const { weather, main, name: cityName } = data;

        const url = this.getIcon(weather[0].icon);

        // setting element
        cityInfoElm.textContent = cityName;
        temperatureElm.textContent = `Temperature: ${main.temp}°C`;
        pressureElm.textContent = `Pressure: ${main.pressure}`;
        humidityElm.textContent = `Humidity: ${main.humidity}`;
        feelElm.textContent = weather[0].main;
        iconElm.setAttribute('src', url);

    },
    init() {
        const { formElm } = this.loadSelector()
        formElm.addEventListener('submit', async e => {
            e.preventDefault();
            /// take input
            const { city, country, isValidated } = this.getInput()
            /// clear input
            this.clearInput();
            if (isValidated) {
                /// setting city and country
                weatherData.city = city;
                weatherData.country = country;

                /// save data to localStorage
                storage.city = city;
                storage.country = country;
                /// save data to localStorage
                storage.saveDataToLocalStorage();
                /// getting data from API
                const data = await weatherData.getData();
                /// populating UI
                this.populateUI(data)
            }
        })
        window.addEventListener('DOMContentLoaded', () => {
            this.getAndPopulateUI()
        })
    }
}
UI.init();


// temporary data store and dealing
const weatherData = {
    city: '',
    country: '',
    APP_ID: '14e7e8a98a19fe7113c41d2a346395f3',
    async getData() {
        /// Requesting data from server
        try {
            const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.APP_ID}`)
            const data = await res.json();

            if (data.cod >= 400) {
                //error
                UI.showMessage(data.message)
                return false
            } else {
                return data
            }
        } catch (err) {
            UI.showMessage('Problem in fetching weather')
        }
    }
}



// localStorage dealing
const storage = {
    city: '',
    country: '',
    saveDataToLocalStorage() {
        localStorage.setItem('BD_WEATHER_CITY', this.city)
        localStorage.setItem('BD_WEATHER_COUNTRY', this.country)
    },
    getData() {
        const city = localStorage.getItem('BD_WEATHER_CITY') || 'Dhaka';
        const country = localStorage.getItem('BD_WEATHER_COUNTRY') || 'Bangladesh';
        return { city, country }
    }
}